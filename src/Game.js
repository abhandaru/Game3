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

    // set up rendering environement
    var width = el.offsetWidth;
    var height = el.offsetHeight;
    this.camera = G3.createCamera({ aspect: width/height });
    this.scene = G3.createScene(this.camera);
    this.renderer = G3.createRenderer(width, height);

    console.log(this.renderer);

    // append renderer to container
    this.el.appendChild(this.renderer.domElement);

    // start rendering
    G3.renderLoop(this, this.render);
  },

  /**
   * Call any logic that would change your game state every timestep.
   * For example, animations may require you to update an object's position.
   * @return void
   */
  render: function() {
    // console.log('unimplemented');
    this.renderer.render(this.scene, this.camera);
  }

});
