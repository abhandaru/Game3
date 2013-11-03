// @copyright 2013
// @author Adu Bhandaru
// Event handling and view logic.

G3.Model = G3.Class.extend({

  // Override this method to create a custom object
  init: function(game) {
    this.game = game;
    this.interactive = false;
  },

  setObject: function(object) {
    this.object = object;
    this.object.G3Model = this;
  },

  show: function(interactive) {
    if (interactive === undefined)
      interactive = false;
    this.interactive = interactive;
    // render in the scene
    if (interactive)
      this.game.addDynamic(this.object);
    else
      this.game.addStatic(this.object);
  },

  hide: function() {
    // remove object from scene
  }

});
