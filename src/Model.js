// @copyright 2013
// @author Adu Bhandaru
// Event handling and view logic.

Game3.Model = Game3.Class.extend({

  /**
   * Some initial set up.
   * Removed from init constructor to hide boilerplate.
   * @param {Game3.Game} game Reference to game class, for message passing.
   */
  before_init: function(game) {
    this.game = game;
    this.interactive = false;
  },

  /**
   * Override this method to create a custom object
   * @param {Game3.Game} game Reference to game class, for message passing.
   */
  init: function(game) { },


  /**
   * Protected interface for setting the mesh for this model.
   * @param {THREE.Object3D} mesh The mesh for this model.
   */
  setMesh: function(mesh) {
    this.mesh = mesh;
    this.mesh.Game3Model = this;
  },


  /**
   * Public interface for getting the mesh for this model.
   * TODO: This might change to return a THREE.Object3D
   * @return {THREE.Mesh} The mesh associated with this model.
   */
  getMesh: function() {
    return this.mesh;
  },

  /**
   * Render the object in the scence.
   * You only need to run this once. However, if you want to change if
   * something is interactive or not, you'll have to remove it, then show
   * it again. Making lots of interactive objects is slow!
   * @param {Boolean} interactive Whether or not to send events to this object.
   */
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
