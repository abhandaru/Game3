// @copyright 2013
// @author Adu Bhandaru
// G3 Light model for quick point lighting.

G3.Light = G3.Class.extend({

  init: function(game, color, position) {
    this.game = game;
    // optional arguments
    if (color === undefined)
      color = 0xFFFFFF;
    if (position === undefined)
      position = new THREE.Vector3(0, 0, 0);
    // create object
    var light = new THREE.PointLight(color);
    light.position = position;
    this.setLight(light);
  },

  setLight: function(light) {
    if (light === undefined)
      return light;
    this.light = light;
  },

  show: function() {
    this.game.addLight(this.light);
  }

});
