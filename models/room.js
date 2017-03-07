function Room(name, number, owner) {  
  this.name = name;
  this.number = number;
  this.owner = owner;
  this.people = [];
  this.status = "available";
};

Room.prototype.addPerson = function(personID) {  
  if (this.status === "available") {
    this.people.push(personID);
  }
};

module.exports = Room; 