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
    var _this = this;
    var types = ['click', 'mousedown', 'mouseup', 'mousemove'];
    // bind for all these events
    types.forEach(function(type) {
      var handler = _this.wrapper(_this[type]);
      container.addEventListener(type, handler);
    });
  },


  wrapper: function(handler) {
    var _this = this;
    return function(event) {
      var coords = new THREE.Vector2(event.layerX, event.layerY);
      var eventG3 = new Game3.Event({
        delta2D: coords.clone().sub(_this.lastMousePosition),
        point2D: coords
      });

      // see if we hit anything in the scene
      var targets = _this.getTargets(coords.x, coords.y);
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
        eventG3.set({ model: _this.game });
      }

      // run the corresponding handler
      var ret = handler.apply(_this, [eventG3]);

      // clean up
      _this.checkFocus(eventG3.model, coords);
      _this.lastMousePosition.set(coords.x, coords.y);
      event.preventDefault();
      return ret;
    };
  },


  resolveEvent: function(model, handler, event) {
    if (this.sendEvent(model, handler, event))
      return true;
    // otherwise, send to game
    return this.sendEvent(this.game, handler, event);
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
    return this.resolveEvent(event.model, 'click', event);
  },


  mousedown: function(event) {
    this.lastClick = event.model;
    this.isMouseDown = true;
    return this.resolveEvent(event.model, 'mousedown', event);
  },


  mouseup: function(event) {
    this.isMouseDown = false;
    var ret = this.resolveEvent(event.model, 'mouseup', event);
    // run drop handler
    if (this.lastDrag) {
      this.resolveEvent(this.lastDrag, 'mousedrop', event);
      this.lastDrag = null;
    }
    // clean up
    return ret;
  },


  mousemove: function(event) {
    var target = event.model;
    var ret = this.resolveEvent(target, 'mousemove', event);
    // check for change of focus (hover)
    if (this.lastOver !== target) {
      this.resolveEvent(target, 'mouseover', event);
    }
    // check for drags
    if (this.isMouseDown && this.lastClick === target) {
      this.lastDrag = target;
      this.resolveEvent(target, 'mousedrag', event);
    } else if (this.isMouseDown && this.lastDrag) {
      this.resolveEvent(this.lastDrag, 'mousedrag', event);
    }
    // clean up
    return ret;
  },


  checkFocus: function(current, coords) {
    var focus = this.lastOver;
    var ret = false;
    if (focus && (!current || focus !== current)) {
      var event = new Game3.Event({
        point2D: coords.clone(),
        model: focus
      })
      ret = this.resolveEvent(focus, 'mouseout', event);
    }
    // update the focus
    this.lastOver = current;
    return ret;
  },


  /**
   * If the model/view has a handler for this event, we will call it.
   * These handler names will be published to the API.
   * @param {Game3.Model} model The model/view to send the event to.
   * @param {Function(Game3.Event)} handler The handler to call (if it exists).
   * @param {Game3.Event} event The event to send.
   */
  sendEvent: function(model, handler, event) {
    var handlerFn = model[handler];
    if (model && handlerFn && typeof handlerFn == 'function') {
      return handlerFn.apply(model, [event]) !== false;
    }
    return false;
  }

});
