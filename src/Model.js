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
    this._parent = null;
    this._mesh = null;
    this._hitbox = null;
    // public members
    this.game = game;
    this.interactive = false;
  },


  /**
   * Override this method to create a custom object
   * @param {Game3.Game} game Reference to game class, for message passing.
   */
  init: function(game) { },


  /**
   * Add this model to the scene and game.
   * @param {Object} object The child object.
   */
  add: function(object) {
    // set up hierarchy only for Game3 Models.
    if (object instanceof Game3.Model)
      object.parent(this);
    return this.game.add(object);
  },


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
   * Protected interface for getting or setting the hitbox for this model.
   * @param {Game3.Model?} The parent model for this instance, if any.
   */
  parent: function(parent) {
    if (parent === undefined)
      return this._parent;
    this._parent = parent;
  },


  hide: function() {
    // remove object from scene
    console.error('Feature unimplemented.');
  }

});
