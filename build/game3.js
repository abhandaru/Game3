// Game3 - http://abhandaru.github.io/Game3/
// (c)2013 Adu Bhandaru

// @copyright 2013
// @author Adu Bhandaru
// The Game3 namespace contains no state.

(function(window) {

// create a namespace
var Game3 = window.Game3 = { };

// get WebGL support
Game3.webgl = (function () {
  try {
    return !!window.WebGLRenderingContext
        && !!document.createElement('canvas').getContext('experimental-webgl');
  } catch(e) {
    return false;
  }
})();

// renderer factory accounts for WebGL support
Game3.createRenderer = function(width, height) {
  if(Game3.webgl) {
    var renderer = new THREE.WebGLRenderer({
      antialias: true,            // to get smoother output
      preserveDrawingBuffer: true // to allow screenshot
    });
    renderer.setClearColor(0xFFFFFF, 1);
  } else {
    renderer = new THREE.CanvasRenderer();
  }
  renderer.setSize(width, height);
  return renderer;
};

// scene factory
Game3.createScene = function(camera) {
  var scene = new THREE.Scene();
  scene.add(camera);
  camera.lookAt(scene.position);
  return scene;
};

/**
 * The camera factory does a little bit more work for you.
 * The options hash can set custom properties for you camera.
 * To override any of the defaults below, just set them in the options hash.
 * @param {Object} options The options hash.
 * @return {THREE.Camera} A camera to render the scene with.
 */
Game3.createCamera = function(options) {
  // merge the options
  options = options || { };
  var viewAngle = options.viewAngle || 60;
  var aspect = options.aspect || 1;
  var near = options.near || 0.1;
  var far = options.far || 10000;
  var position = options.position || (new THREE.Vector3(500, 500, 500));

  // create the camera
  var camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
  camera.position = position;
  return camera;
}

/**
 * Loop an animation function.
 * @param {Object} caller The context to run the animate function in.
 * @param {Function} renderFn Animation function.
 */
Game3.renderLoop = function(caller, renderFn) {
  var render = function() {
    window.requestAnimationFrame(render);
    renderFn.apply(caller);
  };
  render();
};

})(window);
/*
 * Simple JavaScript Inheritance
 * @author John Resig (http://ejohn.org/)
 * MIT Licensed.
 */

// Inspired by base2 and Prototype
(function(Game3) {
  var initializing = false;
  var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  Game3.Class = function() { };

  // Create a new Class that inherits from this class
  Game3.Class.extend = function(prop) {
    prop = (prop === undefined) ? {} : prop;
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if (!initializing) {
        if (this.before_init)
          this.before_init.apply(this, arguments);
        if (this.init)
          this.init.apply(this, arguments);
        if (this.after_init)
          this.after_init.apply(this, arguments);
      }
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})(Game3);
// @copyright 2013
// @author Adu Bhandaru
// The Game3 collision object.

Game3.Collision = Game3.Class.extend({

  init: function(params) {
    this.set(params);
  },

  set: function(params) {
    // set up options
    params           = params             || { };
    this.point       = params.point       || this.point       || null;
    this.face        = params.face        || this.face        || null;
    this.mesh        = params.mesh        || this.mesh        || null;
    this.other       = params.other       || this.other       || null;
    // stuff for computed properties
    this._normal     = params.normal      || this._normal     || null;
    this._correction = params.correction  || this._correction || null;
  },

  normal: function() {
    return this._normal || (this.face && this.face.normal) || null;
  },

  correction: function() {
    return this._correction || new THREE.Vector3(0, 0, 0);
  }

});
// @copyright 2013
// @author Adu Bhandaru
// The Game3 collision detector object.

// constants
Game3.COLLISIONS_GENERAL = 1;
Game3.COLLISIONS_SPHERES = 2;


Game3.Collisions = Game3.Class.extend({

  /**
   * Constructor for the collision tracker.
   * Tracks all models in the system you want, and sends collision events to
   * them every time check is run using a predetermined collision detector.
   * @param {Array<Game3.Model>} models A list of modules to track.
   * @param {DEFINE} type The type of detector to use. If no detector is
   *     selected, a general purpose (slower) one will be used.
   */
  init: function(models, type) {
    // options
    this.models = models || [ ];
    // figure out which check function to use
    type = (type !== undefined) ? type : Game3.COLLISIONS_GENERAL;
    switch (type) {
      case Game3.COLLISIONS_GENERAL:
        this.checkFn = this._checkGeneral; break;
      case Game3.COLLISIONS_SPHERES:
        this.checkFn = this._checkSphere; break;
      default:
        this.checkFn = this._checkGeneral;
    }
  },


  /**
   * Add more models to track for collisions.
   * @param {Game3.Model} model The model to track.
   */
  track: function(model) {
    this.models.push(model);
  },


  /**
   * Checks for all collisions in the models list.
   * TODO: This could be more efficient.
   * 1) The object list contains the object itself, which (correctly) does
   * not return a collision. But why do this check anyways?
   * 2) If A and B intersect, A does the check, then B does the check.
   * Note, the cases are not entirely symmetrical.
   * See: http://stackoverflow.com/a/12264206/408940
   */
  check: function() {
    for (var i = 0; i < this.models.length - 1; i++) {
      for (var j = i + 1; j < this.models.length; j++) {
        var modelA = this.models[i];
        var modelB = this.models[j];
        var meshA = modelA.getMesh();
        var meshB = modelB.getMesh();
        var collisionA = this.checkFn(meshA, meshB);
        var collisionB = this.checkFn(meshB, meshA);
        if (collisionA && collisionB) {
          this._sendCollision(modelA, collisionA);
          this._sendCollision(modelB, collisionB);
        }
      }
    }
  },


  //
  // Private methods
  //


  /**
   * Generalized check intersection function.
   * See: http://stackoverflow.com/a/12264206/408940
   * @param {THREE.Mesh} mesh Object to check against.
   * @return {Game3.Collision?} collision A collision object, if one occurred.
   */
  _checkGeneral: function(meshA, meshB) {
    var collision = null;
    var err = 10;
    // iterate through all the verticies.
    meshA.geometry.vertices.some(function(vertex) {
      var globalVertex = vertex.clone().applyProjection(meshA.matrix);
      var direction = globalVertex.sub(meshA.position);
      var dist = direction.length();
      // create ray and test intersections
      var ray = new THREE.Raycaster(
        meshA.position, direction.clone().normalize(), 0, dist + err);
      var intersects = ray.intersectObject(meshB);
      if (intersects.length > 0 &&
          intersects[0].distance < dist) {
        collision = this._getCollision(direction, intersects[0]);
        return true;
      }
    }, this);
    // clean up
    return collision;
  },


  _checkSphere: function(sphereA, sphereB) {
    var radiusA = sphereA.geometry.radius;
    var radiusB = sphereB.geometry.radius;
    var distance = sphereB.position.clone().sub(sphereA.position);
    var difference = distance.length() - (radiusA + radiusB);
    if (difference < 0) {
      var unit = distance.normalize();
      var point = unit.clone().multiplyScalar(radiusA).add(sphereA.position);
      var normal = unit.clone().negate();
      var correction = unit.clone().multiplyScalar(difference / 2);
      return new Game3.Collision({
        point: point,
        face: null,
        normal: normal,
        correction: correction,
        mesh: sphereB,
        other: sphereB.Game3Model
      });
    }
    return null;
  },


  _sendCollision: function(model, collision) {
    // send the collision event to the handler
    var handler = model.collision;
    if (handler && typeof handler == 'function') {
      handler.apply(model, [collision]);
      return true;
    }
    return false;
  },


  _getCollision: function(direction, intersection) {
    var difference = intersection.distance - direction.length();
    var correction = direction.clone().normalize().multiplyScalar(difference/2);
    return new Game3.Collision({
      point: intersection.point,
      face: intersection.face,
      mesh: intersection.object,
      other: intersection.object.Game3Model,
      correction: correction
    });
  }
});
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
    this.game = game;
    this.interactive = false;
  },

  /**
   * Override this method to create a custom object
   * @param {Game3.Game} game Reference to game class, for message passing.
   */
  init: function(game) { },


  /**
   * Protected interface for setting the mesh for this model.
   * @param {THREE.Object3D} mesh The mesh for this model.
   */
  setMesh: function(mesh) {
    this.mesh = mesh;
    this.mesh.Game3Model = this;
  },


  /**
   * Public interface for getting the mesh for this model.
   * TODO: This might change to return a THREE.Object3D
   * @return {THREE.Mesh} The mesh associated with this model.
   */
  getMesh: function() {
    return this.mesh;
  },

  /**
   * Render the object in the scence.
   * You only need to run this once. However, if you want to change if
   * something is interactive or not, you'll have to remove it, then show
   * it again. Making lots of interactive objects is slow!
   * @param {Boolean} interactive Whether or not to send events to this object.
   */
  show: function(interactive) {
    if (interactive === undefined)
      interactive = false;
    this.interactive = interactive;
    // render in the scene
    if (interactive)
      this.game.addDynamic(this.mesh);
    else
      this.game.addStatic(this.mesh);
  },


  hide: function() {
    // remove object from scene
    // unimplemented
  }

});
// @copyright 2013
// @author Adu Bhandaru
// Game3 Light model for quick point lighting.

Game3.Light = Game3.Class.extend({

  init: function(game, color, position) {
    this.game = game;
    // optional arguments
    if (color === undefined)
      color = 0xFFFFFF;
    if (position === undefined)
      position = new THREE.Vector3(0, 0, 0);
    // create object
    var light = new THREE.PointLight(color);
    light.position = position;
    this.setLight(light);
  },

  setLight: function(light) {
    if (light === undefined)
      return light;
    this.light = light;
  },

  show: function() {
    this.game.addLight(this.light);
  }

});
// @copyright 2013
// @author Adu Bhandaru
// The Game3 event class.

Game3.Event = Game3.Class.extend({

  init: function(params) {
    this.set(params);
  },

  set: function(params) {
    params        = params || { };
    this.distance = params.distance || this.distance || -1;
    this.delta2D  = params.delta2D  || this.delta2D  || new THREE.Vector2(0, 0);
    this.point2D  = params.point2D  || this.point2D  || new THREE.Vector2(0, 0);
    this.point3D  = params.point3D  || this.point3D  || new THREE.Vector3(0, 0, 0);
    this.face     = params.face     || this.face     || null;
    this.mesh     = params.mesh     || this.mesh     || null;
    this.model    = params.model    || this.model    || null;
  }

});
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

    // save some useful information
    this.width = width;
    this.height = height;

    // set up rendering environement
    this.camera = Game3.createCamera({ aspect: width/height });
    this.scene = Game3.createScene(this.camera);
    this.renderer = Game3.createRenderer(width, height);
    this.canvas = this.renderer.domElement;
    this.el.appendChild(this.canvas);

    // delegate tasks
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
   */
  addDynamic: function(object) {
    this.events.track(object);
    this.scene.add(object);
  },


  /**
   * Interface for adding a light to the scene.
   * @param {THREE.Light} light The light to add to the scene.
   */
  addLight: function(light) {
    this.scene.add(light);
  },


  /**
   * Call any logic that would change your game state every timestep.
   * For example, animations may require you to update an object's position.
   * @return {void}
   */
  timerfired: function() { },


  /**
   * This gets called by the render loop.
   * @return {void}
   */
  render: function() {
    this.timerfired();
    this.renderer.render(this.scene, this.camera);
  }



});