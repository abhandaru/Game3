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

      // see if we hit anything in the scene
      var ret = undefined;
      var model = null;
      var targets = that.getTargets(event.clientX, event.clientY);
      if (targets.length) {
        var target = targets[0];
        var eventG3 = new G3.Event({
          distance: target.distance,
          point2D: that.lastMousePosition,
          point3D: target.point,
          face: target.face,
          mesh: target.object,
          model: target.object.G3Model
        });
        model = eventG3.model;
        ret = handler.apply(that, [eventG3]);
      }

      // clean up
      that.checkFocus(model);
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


  click: function(event) {
    var handler = event.model.click;
    this.sendEvent(event.model, handler, event);
  },


  mousedown: function(event) {
    this.isMouseDown = true;
    var handler = event.model.mousedown;
    this.sendEvent(event.model, handler, event);
  },


  mouseup: function(event) {
    this.isMouseDown = false;
    var handler = event.model.mouseup;
    this.sendEvent(event.model, handler, event);
  },


  mousemove: function(event) {
    var target = event.model;
    var handler = target.mousemove;
    this.sendEvent(target, handler, event);
    // check for change of focus (hover)
    if (this.focus !== target) {
      this.sendEvent(target, target.mouseover, event);
    }
  },


  checkFocus: function(current) {
    var focus = this.focus;
    if (focus && (!current || focus !== current)) {
      var event = new G3.Event({
        point2D: this.lastMousePosition
      })
      this.sendEvent(focus, focus.mouseout, event);
    }
    // update the focus
    this.focus = current;
  },


  /**
   * If the model/view has a handler for this event, we will call it.
   * These handler names will be published to the API.
   * @param {G3.Model} model The model/view to send the event to.
   * @param {Function(G3.Event)} handler The handler to call (if it exists).
   * @param {G3.Event} event The event to send.
   */
  sendEvent: function(model, handler, event) {
    if (model && handler && typeof handler == 'function') {
      handler.apply(model, [event]);
      return true;
    }
    return false;
  }

});
