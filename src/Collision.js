// @copyright 2013
// @author Adu Bhandaru
// The Game3 collision object.

Game3.Collision = Game3.Class.extend({

  init: function(params) {
    this.set(params);
  },

  set: function(params) {
    // set up options
    params           = params             || { };
    this.point       = params.point       || this.point       || null;
    this.face        = params.face        || this.face        || null;
    this.mesh        = params.mesh        || this.mesh        || null;
    this.other       = params.other       || this.other       || null;
    // stuff for computed properties
    this._normal     = params.normal      || this._normal     || null;
    this._correction = params.correction  || this._correction || null;
  },

  normal: function() {
    return this._normal || (this.face && this.face.normal) || null;
  },

  correction: function() {
    return this._correction || new THREE.Vector3(0, 0, 0);
  }

});
