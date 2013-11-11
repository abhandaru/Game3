// @copyright 2013
// @author Adu Bhandaru
// Logic for sending messages to objects.

Game3.Events = Game3.Class.extend({

  init: function(game) {
    // save game ref to send messages to
    this.game = game;
    this.objects = [ ];
    this.projector = new THREE.Projector();

    // some state to track events
    this.isMouseDown = false;
    this.lastMousePosition = new THREE.Vector2(0, 0);
    this.lastOver = null;
    this.lastClick = null;
    this.lastDrag = null;

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
      var coords = new THREE.Vector2(event.layerX, event.layerY);
      var eventG3 = new Game3.Event({
        delta2D:  coords.clone().sub(that.lastMousePosition),
        point2D:  coords
      });

      // see if we hit anything in the scene
      var targets = that.getTargets(coords.x, coords.y);
      if (targets.length) {
        var target = targets[0];
        // add the extra event data
        eventG3.set({
          distance: target.distance,
          point3D: target.point,
          face: target.face,
          mesh: target.object,
          model: target.object.Game3Model
        });
      } else {
        eventG3.set({ model: that.game });
      }

      // run the handler
      var ret = handler.apply(that, [eventG3]);

      // clean up
      that.checkFocus(eventG3.model, coords);
      that.lastMousePosition.set(coords.x, coords.y);
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
    this.lastClick = event.model;
    var handler = event.model.click;
    this.sendEvent(event.model, handler, event);
  },


  mousedown: function(event) {
    this.lastClick = event.model;
    this.isMouseDown = true;
    var handler = event.model.mousedown;
    this.sendEvent(event.model, handler, event);
    // run drop handler
    if (this.lastDrag) {
      this.sendEvent(this.lastDrag, this.lastDrag.mousedrop, event);
      this.lastDrag = null;
    }
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
    if (this.lastOver !== target) {
      this.sendEvent(target, target.mouseover, event);
    }
    // check for drags
    if (this.isMouseDown && this.lastClick === target) {
      this.lastDrag = target;
      this.sendEvent(target, target.mousedrag, event);
    } else if (this.isMouseDown && this.lastDrag) {
      this.sendEvent(this.lastDrag, this.lastDrag.mousedrag, event);
    }
  },


  checkFocus: function(current, coords) {
    var focus = this.lastOver;
    if (focus && (!current || focus !== current)) {
      var event = new Game3.Event({
        point2D: coords.clone(),
        model: focus
      })
      this.sendEvent(focus, focus.mouseout, event);
    }
    // update the focus
    this.lastOver = current;
  },


  /**
   * If the model/view has a handler for this event, we will call it.
   * These handler names will be published to the API.
   * @param {Game3.Model} model The model/view to send the event to.
   * @param {Function(Game3.Event)} handler The handler to call (if it exists).
   * @param {Game3.Event} event The event to send.
   */
  sendEvent: function(model, handler, event) {
    if (model && handler && typeof handler == 'function') {
      handler.apply(model, [event]);
      return true;
    }
    return false;
  }

});
