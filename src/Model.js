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
    this.__parent = null;
    this.__children = [ ];
    this.__visible = false;
    this.__mesh = null;
    this.__hitbox = null;
    this.__waiting = 0;
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
    if (object instanceof Game3.Model) {
      object.parent(this);
    }

    // update child-links and add if we are already visible.
    this.__children.push(object);
    return (this.__visible) ? this.game.add(object) : true;
  },


  /**
   * Protected interface for getting or setting the mesh for this model.
   * @param {THREE.Object3D?} mesh The mesh for this model.
   */
  mesh: function(mesh) {
    if (mesh === undefined)
      return this.__mesh;
    // set the mesh
    this.__mesh = mesh;
    this.__mesh.Game3Model = this;
  },


  /**
   * Protected interface for getting or setting the hitbox for this model.
   * @param {THREE.Object3D?} mesh The hitbox for this model.
   */
  hitbox: function(hitbox) {
    if (hitbox === undefined)
      return this.__hitbox;
    // set the mesh
    this.__hitbox = hitbox;
    this.__hitbox.Game3Model = this;
  },


  /**
   * Returns the model status.
   * This is useful for checking if the geometry for this particular model
   * has finished loading.
   * @return {boolean} True if the model is ready.
   */
  ready: function() {
    return this.__waiting == 0;
  },


  /**
   * Load the geometry from the given path.
   * @param {string} path The path to the objects JSON file.
   * @param {function(mesh, geometry, materials)} callback The user's function
   *     call after setting up the mesh.
   */
  load: function(path, callback) {
    // record we are waiting for a resource to load.
    this.__waiting++;

    // use THREE.js loader and wrap the user's callback
    var loader = new THREE.JSONLoader();
    loader.load(path, function(geometry, materials) {
      var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
      if (Game3.isFunction(callback))
        callback.apply(this, [mesh, geometry, materials]);

      // clean up
      this.__waiting--;
      this.game.add(this);
    }.bind(this));
  },


  /**
   * Protected interface for getting or setting the hitbox for this model.
   * @param {Game3.Model?} The parent model for this instance, if any.
   * TODO: Update the children fields of the old parent and new parent too.
   */
  parent: function(parent) {
    if (parent === undefined)
      return this.__parent;
    this.__parent = parent;
  },


  //
  // Internal Game3 use only.
  //

  __show: function() {
    this.__visible = true;
    this.__children.forEach(function(child) {
      this.game.add(child);
    }, this);
  }

});
