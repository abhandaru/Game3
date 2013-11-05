// @copyright 2013
// @author Adu Bhandaru
// The G3 event class.

G3.Event = G3.Class.extend({

  init: function(params) {
    this.set(params);
  },

  set: function(params) {
    params        = params || { };
    this.distance = params.distance || this.distance || -1;
    this.delta2D  = params.delta2D  || this.delta2D  || new THREE.Vector2(0, 0);
    this.point2D  = params.point2D  || this.point2D  || new THREE.Vector2(0, 0);
    this.point3D  = params.point3D  || this.point3D  || new THREE.Vector3(0, 0, 0);
    this.face     = params.face     || this.face     || null;
    this.mesh     = params.mesh     || this.mesh     || null;
    this.model    = params.model    || this.model    || null;
  }

});
