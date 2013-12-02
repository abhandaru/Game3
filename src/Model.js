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
    this._mesh = null;
    this._hitbox = null;
  },


  /**
   * Override this method to create a custom object
   * @param {Game3.Game} game Reference to game class, for message passing.
   */
  init: function(game) { },


  /**
   * Protected interface for getting or setting the mesh for this model.
   * @param {THREE.Object3D?} mesh The mesh for this model.
   */
  mesh: function(mesh) {
    if (mesh === undefined)
      return this._mesh;
    // set the mesh
    this._mesh = mesh;
    this._mesh.Game3Model = this;
  },


  /**
   * Protected interface for getting or setting the hitbox for this model.
   * @param {THREE.Object3D?} mesh The hitbox for this model.
   */
  hitbox: function(hitbox) {
    if (hitbox === undefined)
      return this._hitbox;
    // set the mesh
    this._hitbox = hitbox;
    this._hitbox.Game3Model = this;
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
      this.game.addDynamic(this._mesh, this._hitbox);
    else
      this.game.addStatic(this._mesh);
  },


  hide: function() {
    // remove object from scene
    // unimplemented
  }

});
