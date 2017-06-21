function Room(name, number, owner, ownername, photo) { 
  this.name = name;
  this.number = number;
  this.owner = owner;
  this.people = [];
  this.ready = new Array({user: ownername, photo: photo});
  this.gameOn = false;
  this.status = "available";
};

Room.prototype.addPerson = function(personID) {  
  if (this.status === "available") {
    this.people.push(personID);
  }
};

module.exports = Room; 