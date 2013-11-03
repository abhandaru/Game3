// @copyright 2013
// @author Adu Bhandaru
// Logic for sending messages to objects.

G3.Events = G3.Class.extend({

  init: function(game) {
    // save game ref to send messages to
    this.game = game;
    this.objects = [ ];
    this.projector = new THREE.Projector();

    // some state to track events
    this.isMouseDown = false;
    this.lastMousePosition = new THREE.Vector2(0, 0);
    this.focus = null;

    // delegate tasks
    this.bind(game.canvas);
  },


  /**
   * Add an object to track and send events to.
   * @param {THREE.Object3D} object The object to track.
   */
  track: function(object) {
    this.objects.push(object);
  },


  /**
   * These are the only events we need to bind. We can derive the rest.
   * @param {HTMLElement} container The container to bind to.
   */
  bind: function(container) {
    var that = this;
    var types = ['click', 'mousedown', 'mouseup', 'mousemove'];
    // bind for all these events
    types.forEach(function(type) {
      var handler = that.wrapper(that[type]);
      container.addEventListener(type, handler);
    });
  },


  wrapper: function(handler) {
    var that = this;
    return function(event) {
      that.lastMousePosition.set(event.pageX, event.pageY);

      var focus = null;
      var targets = that.getTargets(event.clientX, event.clientY);

      // run the handler
      var ret = undefined;
      if (handler && typeof handler == "function") {
        ret = handler.apply(that, event);
      }

      // clean up
      event.preventDefault();
      return ret;
    };
  },


  getTargets: function(x, y) {
    var camera = this.game.camera;
    var vector = new THREE.Vector3(
        (x/this.game.width)*2 - 1,
        -(y/this.game.height)*2 + 1,
        0.5);
    this.projector.unprojectVector(vector, camera);
    var raycaster = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(this.objects);
    return intersects;
  },

  click: function(event) { },


  mousedown: function(event) {
    this.isMouseDown = true;
  },


  mouseup: function(event) {
    this.isMouseDown = false;
  },


  mousemove: function(event) { }

});
