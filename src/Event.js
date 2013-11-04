// @copyright 2013
// @author Adu Bhandaru
// The G3 event class.

G3.Event = G3.Class.extend({

  init: function(params) {
    params = params || { };
    this.distance = params.distance || -1;
    this.point2D = params.point2D || new THREE.Vector2(0, 0);
    this.point3D = params.point3D || new THREE.Vector3(0, 0, 0);
    this.face = params.face || null;
    this.mesh = params.mesh || null;
    this.model = params.model || null;
  }

});
