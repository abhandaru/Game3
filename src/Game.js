// @copyright 2013
// @author Adu Bhandaru
// Outermost game class.

G3.Game = G3.Class.extend({

  /**
   * Called when the object is constructed.
   * Logic that sets up the game. This means setting up the canvas (mostly).
   */
  init: function(el) {
    this.el = el;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    // save some useful information
    this.width = width;
    this.height = height;

    // set up rendering environement
    this.camera = G3.createCamera({ aspect: width/height });
    this.scene = G3.createScene(this.camera);
    this.renderer = G3.createRenderer(width, height);
    this.el.appendChild(this.renderer.domElement);

    // track objects in scene for this class
    this.lights = [ ];
    this.dynamic = [ ];
    this.static = [ ];

    // start rendering
    G3.renderLoop(this, this.render);
  },


  /**
   * Interface for adding a non-interactive object to the scene. These objects
   * will not be sent mouse events, and will not affect line-of-sight events.
   * @param {THREE.Object} object The object to add to the scene.
   */
  addStatic: function(object) {
    this.static.push(object);
    this.scene.add(object);
  },


  /**
   * Interface for adding an interactive object to the scene. These objects
   * will be sent mouse events.
   * @param {THREE.Object} object The object to add to the scene.
   */
  addDynamic: function(object) {
    this.dynamic.push(object);
    this.scene.add(object);
  },


  /**
   * Interface for adding a light to the scene.
   * @param {THREE.Light} light The light to add to the scene.
   */
  addLight: function(light) {
    this.lights.push(light);
    this.scene.add(light);
  },


  /**
   * Call any logic that would change your game state every timestep.
   * For example, animations may require you to update an object's position.
   * @return void
   */
  render: function() {
    this.renderer.render(this.scene, this.camera);
  }

});
