// @copyright 2013
// @author Adu Bhandaru
// The Game3 event class.

Game3.Event = Game3.Class.extend({

  init: function(params) {
    this.set(params);
  },

  set: function(params) {
    params            = params || { };
    this.model        = params.model    || this.model    || null;
    this.native       = params.native   || this.native   || null;
    // for clicking
    this.distance     = params.distance || this.distance || null;
    this.delta2D      = params.delta2D  || this.delta2D  || null;
    this.point2D      = params.point2D  || this.point2D  || null;
    this.point3D      = params.point3D  || this.point3D  || null;
    this.face         = params.face     || this.face     || null;
    this.mesh         = params.mesh     || this.mesh     || null;
  },

  // computed properties
  wheelDelta: function() {
    var isWheel = this.native.wheelDeltaX !== undefined;
    var delta = new THREE.Vector2(this.native.wheelDeltaX, this.native.wheelDeltaY);
    return (isWheel && delta) || null;
  }
});
