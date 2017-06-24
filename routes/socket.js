var sockets = require('socket.io');
var Room = require('../models/room.js');

module.exports = initSocket;

function initSocket(server, rooms) {
    var sks = sockets.listen(server);

    var carorooms = sks.of('/roomlist').on('connection', function(socket) {
        socket.emit('roomupdate', JSON.stringify(rooms));
        socket.on('newroom', function(data) {
            var check = findOwnerRoom(data.user.id);
            if (check == -1) {
                var newRoom = new Room(data.room_name, data.room_number, data.user.id, data.user.name, data.user.photo);
                rooms.push(newRoom);
                socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
                socket.emit('roomupdate', JSON.stringify(rooms));
            } else {
                socket.emit('update', 'You have already create and join room ' + rooms[check].number + " - " + rooms[check].name);
            }
        })
        socket.on('listroom', function() {
            socket.emit('roomupdate', JSON.stringify(rooms));
        })
    })

    function findOwnerRoom(id) {
        for (var i in rooms) {
            if (rooms[i].owner == id) {
                return i;
            }
        }
        return -1;
    }

    function findRoom(number) {
        for (var i in rooms) {
            if (rooms[i].number == number) {
                return i;
            }
        }
        return -1;
    }

    sks.of('/caro').on('connection', function(socket) {
        socket.on('joinroom', function(data) {
            socket.room = data.room;
            socket.userid = data.user.id;
            socket.username = data.user.name;
            var check = findOwnerRoom(data.user.id);
            socket.join(data.room);
            var checkroom = findRoom(data.room);
            if (checkroom != -1) {
                rooms[checkroom].addPerson(data.user);
                socket.emit('ready', { ready: rooms[checkroom].ready });
            }
            socket.broadcast.to(data.room).emit('msgg', { user: data.user.name, noidung: "đã vào phòng" });
        })
        socket.on('luotchoi', function(data) {
            var luot_choi = Math.floor(Math.random() * 2) + 1;
            var checkroom = findRoom(data.room);
            rooms[checkroom].gameOn = true;
            socket.broadcast.to(data.room).emit('luotchoi', { luotchoi: luot_choi, ready: rooms[checkroom].ready });
            socket.emit('luotchoi', { luotchoi: luot_choi, ready: rooms[checkroom].ready });
        })

        socket.on('vuadi', function(data) {
            socket.broadcast.to(data.room).emit('luotdi', { luotchoi: 3 - data.luotchoi, odi: data.odi });
        })

        socket.on('tinnhan', function(data) {
            socket.broadcast.to(data.room).emit('tinnhan', JSON.stringify(data));
        })

        socket.on('ready', function(data) {
            var checkroom = findRoom(data.room);
            rooms[checkroom].ready.push({ user: data.user, photo: data.photo });
            socket.broadcast.to(data.room).emit('ready', { ready: rooms[checkroom].ready });
            socket.emit('ready', { ready: rooms[checkroom].ready });
        })

        socket.on('disconnect', function() {
            var check = findOwnerRoom(socket.userid);
            var checkroom = findRoom(socket.room);
            socket.broadcast.to(socket.room).emit('hasDisconnect', { name: socket.username });
            if (checkroom != -1) {
                if (rooms[checkroom].ready[0].user == socket.username) {
                    rooms[checkroom].ready.splice(0, 1);
                    socket.broadcast.to(socket.room).emit('ready', { ready: rooms[checkroom].ready });
                }
                if (rooms[checkroom].ready.length > 1 && rooms[checkroom].ready[1].user == socket.username) {
                    rooms[checkroom].ready.splice(1, 1);
                    socket.broadcast.to(socket.room).emit('ready', { ready: rooms[checkroom].ready });
                }
            }
            socket.broadcast.to(socket.room).emit('msgg', { user: socket.username, noidung: "đã rời phòng." });
            socket.leave(socket.room);
            if (check == -1) {
                if (checkroom != -1) {
                    for (var i in rooms[checkroom].people) {
                        if (rooms[checkroom].people[i].id == socket.userid) {
                            rooms[checkroom].people.splice(i, 1);
                        }
                    }
                }
            } else {
                if (rooms[check].people.length == 1) {
                    rooms.splice(check, 1);
                } else {
                    for (var i in rooms[check].people) {
                        if (rooms[check].people[i].id == socket.userid) {
                            rooms[check].people.splice(i, 1);
                        }
                    }
                    rooms[check].owner = rooms[check].people[0].id;
                    if (rooms[check].ready.length == 0) {
                        rooms[check].ready.push({ user: rooms[check].people[0].name, photo: rooms[check].people[0].photo });
                    } else {
                        rooms[check].ready[0].user = rooms[check].people[0].name;
                        rooms[check].ready[0].photo = rooms[check].people[0].photo;
                    }
                    socket.broadcast.to(socket.room).emit('ready', { ready: rooms[check].ready });
                    socket.emit('ready', { ready: rooms[check].ready });
                    socket.broadcast.to(socket.room).emit('msgg', { user: rooms[check].people[0].name, noidung: "là chủ phòng." });
                }
            }

        })

        socket.on('callVideo', (data) => {
            socket.broadcast.to(socket.room).emit('calling', { token: data.token });
        })

        socket.on('answerCall', (data) => {
            socket.broadcast.to(socket.room).emit('answerCall', { token: data.token });
        })
    });
}
