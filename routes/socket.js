var sockets = require('socket.io');
var Room = require('../models/room.js');

module.exports = initSocket;

function initSocket(server, rooms) {
    var sks = sockets.listen(server);
    var ready = [];

    var carorooms = sks.of('/roomlist').on('connection', function (socket) {
        socket.emit('roomupdate', JSON.stringify(rooms));
        socket.on('newroom', function (data) {
            var check = findOwnerRoom(data.user.id);
            if (check == -1){
                var newRoom = new Room(data.room_name, data.room_number, data.user.id);
                rooms.push(newRoom);
                socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
                socket.emit('roomupdate', JSON.stringify(rooms));
            }
            else{
                socket.emit('update','You have already create and join room '+ rooms[check].room_name);
            }
        })
    })

    function findOwnerRoom(id) {
        for (var i in rooms){
            if (rooms[i].owner == id){
                return i;
            }
        }
        return -1;
    }

    function findRoom(number) {
        for (var i in rooms){
            if (rooms[i].number == number){
                return i;
            }
        }
        return -1;
    }

    sks.of('/caro').on('connection', function(socket) {
        socket.emit('ready', {ready: ready});
        socket.on('joinroom',function (data) {
            var check = findOwnerRoom(data.user.id);
                socket.join(data.room);
                var checkroom = findRoom(data.room);
                if (checkroom != -1){
                    var room = rooms[checkroom];
                    room.addPerson(data.user);
                }
                socket.broadcast.to(data.room).emit('msgg',{user: data.user.name, noidung: "đã vào phòng"});
        })
        socket.on('luotchoi', function(data) {
            socket.broadcast.to(data.room).emit('luotchoi', { luotchoi: data.luotchoi, ready: ready});
            socket.emit('luotchoi', { luotchoi: 3 - data.luotchoi });
        })

        socket.on('vuadi', function(data) {
            socket.broadcast.to(data.room).emit('luotdi', { luotchoi: 3 - data.luotchoi, odi: data.odi });
        })

        socket.on('tinnhan', function(data) {
            socket.broadcast.to(data.room).emit('tinnhan', JSON.stringify(data));
        })

        socket.on('ready', function (data) {
            ready.push(data.user);
            socket.broadcast.to(data.room).emit('ready', {ready: ready});
            socket.emit('ready', {ready: ready});
        })

        socket.on('leaveroom', function (data) {
            var check = findOwnerRoom(data.user.id);
            var checkroom = findRoom(data.room);
            if (ready[0] == data.user.name){
                ready.splice(0,1);
                socket.broadcast.to(data.room).emit('ready', {ready: ready});
            }
            if(ready[1] == data.user.name){
                ready.splice(1,1);
                socket.broadcast.to(data.room).emit('ready', {ready: ready});
            }
            socket.broadcast.to(data.room).emit('msgg',{user:data.user.name, noidung: "đã rời phòng."});
            socket.leave(data.room);
            if (check == -1){
                if (checkroom != -1){
                    for (var i in rooms[checkroom].people){
                        if (rooms[checkroom].people[i].id == data.user.id){
                            rooms[checkroom].people.splice(i,1);
                        }
                    }
                }
            }else{
                if (rooms[check].people.length == 1){
                    rooms.splice(check,1);
                }
                else{
                    for (var i in rooms[check].people){
                        if (rooms[check].people[i].id == data.user.id){
                            rooms[check].people.splice(i,1);
                        }
                    }
                    rooms[check].owner = rooms[check].people[0].id;
                    socket.broadcast.to(data.room).emit('msgg',{user: rooms[check].people[0].name, noidung: "là chủ phòng."});
                }
            }
        })
    });
}
