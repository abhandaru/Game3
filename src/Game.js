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
    var _this = this;

    // bind resize event
    if (this.bindResize) {
      window.addEventListener('resize', function() { return _this.resize(); });
    }

    // bind render loop to timer
    Game3.renderLoop(this, this.render);
  },


  /**
   * Interface for adding a non-interactive object to the scene. These objects
   * will not be sent mouse events, and will not affect line-of-sight events.
   * @param {THREE.Object} object The object to add to the scene.
   */
  addStatic: function(object) {
    this.scene.add(object);
  },


  /**
   * Interface for adding an interactive object to the scene. These objects
   * will be sent mouse events.
   * @param {THREE.Object} object The object to add to the scene.
   * @param {THREE.Object} hitbox The hitbox to use for event handling.
   */
  addDynamic: function(object, hitbox) {
    if (hitbox === undefined)
      hitbox = object;
    this.events.track(hitbox);
    this.scene.add(object);
  },


  /**
   * Interface for adding a light to the scene.
   * @param {THREE.Light} light The light to add to the scene.
   */
  addLight: function(light) {
    this.scene.add(light);
  },


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
  timerfired: function(dt) { },


  /**
   * This gets called by the render loop.
   * @return {void}
   */
  render: function(dt) {
    this.timerfired(dt);
    this.renderer.render(this.scene, this.camera);
  }

});
