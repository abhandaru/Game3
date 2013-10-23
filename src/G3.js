// @copyright 2013
// @author Adu Bhandaru
// The G3 namespace contains no state.

(function(window) {

/*
 * create a namespace
 */
var G3 = window.G3 = { };


// get WebGL support
G3.webgl = (function () {
  try {
    return !!window.WebGLRenderingContext
        && !!document.createElement('canvas').getContext('experimental-webgl');
  } catch(e) {
    return false;
  }
})();

// renderer factory accounts for WebGL support
G3.createRenderer = function(width, height) {
  if(G3.webgl) {
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
G3.createScene = function(camera) {
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
G3.createCamera = function(options) {
  // merge the options
  options = options || { };
  var viewAngle = options.viewAngle || 60;
  var aspect = options.aspect || 1;
  var near = options.near || 0.1;
  var far = options.far || 10000;
  var position = options.position || (new THREE.Vector3(1000, 1000, 1000));

  // create the camera
  var camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
  camera.position = position;
  return camera;
}

// standard render loop
G3.renderLoop = function(caller, renderFn) {
  var render = function() {
    requestAnimationFrame(render);
    renderFn.apply(caller);
  };
  render();
};


})(window);
