// @copyright 2013
// @author Adu Bhandaru
// Outermost game class.

G3.Game = G3.Class.extend({

  /**
   * Called when the object is constructed.
   * Log that sets up the game. This means setting up the canvas (mostly).
   */
  init: function(el) {
    this.el = el;
  },

  /**
   * Call any logic that would change your game state every timestep.
   * For example, animations may require you to update an object's position.
   * @return void
   */
  timestep: function() {
    console.log('unimplemented');
  }

});
