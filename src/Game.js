// @copyright 2013
// @author Adu Bhandaru
// Outermost game class.

Game3.Game = Game3.Class.extend({

  /**
   * Called before the object is constructed.
   * Logic sets up the camera, scene, renderer, and events.
   * @param {HTMLElement} A container for your application.
   */
  before_init: function(el) {
    this.el = el;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    // settings
    this.bindResize = true;

    // save some useful information
    this.width = width;
    this.height = height;

    // set up rendering environement
    this.camera = Game3.createCamera({ aspect: width/height });
    this.scene = Game3.createScene(this.camera);
    this.renderer = Game3.createRenderer(width, height);
    this.canvas = this.renderer.domElement;
    this.el.appendChild(this.canvas);

    // set up events
    this.events = new Game3.Events(this);
  },


  /**
   * Custom init method.
   * This should be overriden in the subclass.
   * @param {HTMLElement} A container for your application.
   */
  init: function(el) { },


  /**
   * This is run after your custom init method.
   * Start the render loop.
   * You should only do this when you are done initializing.
   * @param {HTMLElement} A container for your application.
   */
  after_init: function(el) {
    // bind resize event
    if (this.bindResize) {
      window.addEventListener('resize', this.resize.bind(this), false);
    }

    // bind render loop to timer
    Game3.renderLoop(this, this.__render);
  },


  /**
   * Interface for adding a non-interactive object to the scene. These objects
   * will not be sent mouse events, and will not affect line-of-sight events.
   * @param {THREE.Object} object The object to add to the scene.
   */
  add: function(object) {
    // robustness
    if (!object) return false;

    // adding a light to the scene
    if (object instanceof Game3.Light) {
      var light = object;
      this.scene.add(light.light());
      return true;
    }

    // adding a model to the scene
    else if (object instanceof Game3.Model) {
      var model = object;
      if (model.ready()) {
        var mesh = model.mesh();
        var hitbox = model.hitbox() || mesh;
        var interactive = model.interactive;
        if (mesh) this.scene.add(mesh);
        if (hitbox && interactive) this.events.track(hitbox);
      }

      // link and propogate actions
      if (!model.parent()) model.parent(this);
      model.__show();
      return true;
    }

    // adding a raw THREE.js object
    else if (object instanceof THREE.Light || object instanceof THREE.Object3D) {
      this.scene.add(object);
      return true;
    }

    // user tried to add something weird.
    return false;
  },


  /**
   * Meet the interface for receiving events.
   * @return {Game.Class} The Game class has no parent, always returns null.
   */
  parent: function() {
    return null;
  },


  /**
   * Called when the window is resized to fit the bounds.
   * TODO: Can we watch only for resize events to el (container Element)?
   */
  resize: function() {
    var width = this.width = this.el.offsetWidth;
    var height = this.height = this.el.offsetHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  },


  /**
   * Call any logic that would change your game state every timestep.
   * For example, animations may require you to update an object's position.
   * @return {void}
   */
  update: function(dt) { },


  //
  // Internal Game3 use only.
  //

  /**
   * This gets called by the render loop.
   * @return {void}
   */
  __render: function(dt) {
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
  }

});
