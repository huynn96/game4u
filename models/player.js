function Player(id, name, photo, game) {
    this.id = id;
    this.name = name;
    this.photo = photo;
    this.game = game;
    this.ready = false;
    this.room = -1;
    this.owner = false;
};

Player.prototype.joinroom = function(room) {
    this.room = room;
};

Player.prototype.leaveroom = () => {
    this.room = -1;
}

module.exports = Player;
