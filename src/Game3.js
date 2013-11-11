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
