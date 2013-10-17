// @copyright 2013
// @author Adu Bhandaru
// Every game object derives from Class.

G3.Class = function(attr) {

};

// static methods
G3.Class.extend = function(attr, super) {
  super = super || G3.Class;

  var Subclass = function(attr) {
    super(attr);
  };

  Subclass.extend = function(attr) {
    return super.extend(attr, Subclass);
  };

  Subclass.prototype = new super();
  return Subclass;
};

// instance methods
G3.Class.prototype = {

  init: function() { }
  act: function() { console.log('Class'); }

};