// @copyright 2013
// @author Adu Bhandaru
// Game3 Light model for quick point lighting.

Game3.Light = Game3.Class.extend({

 init: function(color, position) {
    // optional arguments
    if (color === undefined)
      color = 0xFFFFFF;
    if (position === undefined)
      position = new THREE.Vector3(0, 0, 0);
    // create object
    var light = new THREE.PointLight(color);
    light.position = position;
    // set the light
    this.light(light);
  },

  light: function(light) {
    if (light === undefined)
      return this._light;
    this._light = light;
  }

});
