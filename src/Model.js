// @copyright 2013
// @author Adu Bhandaru
// Event handling and view logic.

Game3.Model = Game3.Class.extend({

  // Override this method to create a custom object
  init: function(game) {
    this.game = game;
    this.interactive = false;
  },

  setMesh: function(mesh) {
    this.mesh = mesh;
    this.mesh.Game3Model = this;
  },

  show: function(interactive) {
    if (interactive === undefined)
      interactive = false;
    this.interactive = interactive;
    // render in the scene
    if (interactive)
      this.game.addDynamic(this.mesh);
    else
      this.game.addStatic(this.mesh);
  },

  hide: function() {
    // remove object from scene
    // unimplemented
  }

});
