// @copyright 2013
// @author Adu Bhandaru
// The Game3 collision object.

Game3.Collision = Game3.Class.extend({

  init: function(params) {
    this.set(params);
  },

  set: function(params) {
    params      = params || { };
    this.vertex = params.vertex || this.vertex || null;
    this.point  = params.point  || this.point  || null;
    this.face   = params.face   || this.face   || null;
    this.normal = params.normal || this.normal || null;
    this.mesh   = params.mesh   || this.mesh   || null;
    this.other  = params.other  || this.other  || null;
  }

});
