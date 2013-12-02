// @copyright 2013
// @author Adu Bhandaru
// Logic for sending messages to objects.

// constants
Game3.EVENTS_LEFT_CLICK    = 'click';
Game3.EVENTS_RIGHT_CLICK   = 'rightclick';
Game3.EVENTS_MOUSEMOVE     = 'mousemove';
Game3.EVENTS_MOUSEDOWN     = 'mousedown';
Game3.EVENTS_MOUSEUP       = 'mouseup';
Game3.EVENTS_MOUSEOVER     = 'mouseover';
Game3.EVENTS_MOUSEOUT      = 'mouseout';
Game3.EVENTS_MOUSEDRAG     = 'mousedrag';
Game3.EVENTS_MOUSEDROP     = 'mousedrop';
Game3.EVENTS_MOUSESCROLL   = 'scroll';


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
    var types = [
        'click',
        'mousedown',
        'mouseup',
        'mousemove',
        'wheel',
        'contextmenu'];
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
        native: event,
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
      if (ret) event.preventDefault();
      return ret;
    };
  },


  //
  // Specific event handlers
  //

  click: function(event) {
    this.lastClick = event.model;
    return this.resolveEvent(event.model, Game3.EVENTS_LEFT_CLICK, event);
  },


  mousedown: function(event) {
    this.lastClick = event.model;
    this.isMouseDown = true;
    return this.resolveEvent(event.model, Game3.EVENTS_MOUSEDOWN, event);
  },


  mouseup: function(event) {
    this.isMouseDown = false;
    var ret = this.resolveEvent(event.model, Game3.EVENTS_MOUSEUP, event);
    // run drop handler
    if (this.lastDrag) {
      this.resolveEvent(this.lastDrag, Game3.EVENTS_MOUSEDROP, event);
      this.lastDrag = null;
    }
    // clean up
    return ret;
  },


  mousemove: function(event) {
    var target = event.model;
    var ret = this.resolveEvent(target, Game3.EVENTS_MOUSEMOVE, event);
    // check for change of focus (hover)
    if (this.lastOver !== target) {
      this.resolveEvent(target, Game3.EVENTS_MOUSEOVER, event);
    }
    // check for drags
    if (this.isMouseDown && this.lastClick === target) {
      this.lastDrag = target;
      this.resolveEvent(target, Game3.EVENTS_MOUSEDRAG, event);
    } else if (this.isMouseDown && this.lastDrag) {
      this.resolveEvent(this.lastDrag, Game3.EVENTS_MOUSEDRAG, event);
    }
    // clean up
    return ret;
  },


  wheel: function(event) {
    var target = event.model;
    return this.resolveEvent(target, Game3.EVENTS_MOUSESCROLL, event);
  },


  contextmenu: function(event) {
    var target = event.model;
    return this.resolveEvent(target, Game3.EVENTS_RIGHT_CLICK, event);
  },


  //
  // Helper functions
  //

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

  checkFocus: function(current, coords) {
    var focus = this.lastOver;
    var ret = false;
    if (focus && (!current || focus !== current)) {
      var event = new Game3.Event({
        point2D: coords.clone(),
        model: focus
      })
      ret = this.resolveEvent(focus, Game3.EVENTS_MOUSEOUT, event);
    }
    // update the focus
    this.lastOver = current;
    return ret;
  },


  resolveEvent: function(model, handler, event) {
    if (this.sendEvent(model, handler, event))
      return true;
    // otherwise, send to game
    return this.sendEvent(this.game, handler, event);
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
