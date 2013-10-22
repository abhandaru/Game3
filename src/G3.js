// @copyright 2013
// @author Adu Bhandaru
// The G3 namespace contains no state.

(function(window) {

/*
 * create a namespace
 */
var G3 = window.G3 = { };

/*
 * Set up graphic environment.
 */
G3.graphics = { };

// get WebGL support
G3.graphics.webgl = (function () {
  try {
    return !!window.WebGLRenderingContext
        && !!document.createElement('canvas').getContext('experimental-webgl');
  } catch(e) {
    return false;
  }
})();

// choose which renderer to use
G3.graphics.renderer = (function() {
  if(Tactics.env.webgl) {
    var renderer = new THREE.WebGLRenderer({
      antialias: true,            // to get smoother output
      preserveDrawingBuffer: true // to allow screenshot
    });
    renderer.setClearColorHex(0xFFFFFF, 1);
  } else {
    renderer = new THREE.CanvasRenderer();
  }
  renderer.setSize(Tactics.gui.width, Tactics.gui.height);
  Tactics.gui.canvas = renderer.domElement;
  Tactics.$el.append(Tactics.gui.canvas);
  return renderer;
})();



})(window);
