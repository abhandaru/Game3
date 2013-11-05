# Game3

Game3 (G3) is a JavaScript framework to write 3D apps using <a href="http://threejs.org/">ThreeJS</a>.

The project is currently in it's infancy. The main problem with most ThreeJS apps is that there is a lot of exposed boilerplate code, and no consistent way to handle events with objects in the scene. Track this project on Github: <a href="https://github.com/abhandaru/Game3">Game3</a>

## Dependencies

You only need the following if you want to build (consolidate and minify) the library. You can edit, test, and contribute without any of this.

- <tt>make</tt> - We use GNU make as a command line tool.
- <tt>uglifyjs</tt> - We use a global UglifyJS install.


## Features
The project is young! We are a little feature light, but worth using and always growing.

- <tt>G3.Class</tt> - Standard inheritance model.
- <tt>G3.Game</tt> - Camera, rendered, and animation are all set up for you.
- <tt>G3.Model</tt> - Bind handlers easily, add state to your scene objects.
- <tt>G3.Event</tt> - Directly sent to you model/view, with rich metadata.
- <tt>this._super</tt> - Easy override and extension.
- Growing fast.

## Simple Example

Here is a simple example using the Game3 framework. By extending the provided base classes, it is easy to customize and override without exposing too much.

    var Game = G3.Game.extend({
      init: function(el) {
        this._super(el);

        // make a cube and a light
        this.cube = new Cube(this);
        this.light = new G3.Light(this, 0xFFFFFF, new THREE.Vector3(200, 150, -200));

        // show objects
        this.cube.show(true); // true -> interactive
        this.light.show();
      },

      // gets called every timer fired
      animate: function() {
        this.cube.animate();
      }
    });

Declaring models and specifying how they'll be rendered is easy. Simply extend the base <tt>Model</tt> class, and only override or supply methods you need.

    var Cube = G3.Model.extend({
      init: function(game) {
        this._super(game);

        // set up geometry
        var grey = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
        this.cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), grey);

        // set object
        this.setObject(this.cube);
      },

      animate: function() {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.02;
      },

Binding event handlers is simple. If you have provided a handler, it will be called transparently. All the projection math is done for you. In an MVC-like pattern, you can operate on the highest level app class from here.

      // Continuing to define Cube class.
      mouseover: function(event) {
        var rand = Math.floor(Math.random() * 0xFFFFFF);
        this.cube.material.color.setHex(rand);
      },

      mouseout: function(event) {
        this.cube.material.color.setHex(0xCCCCCC);
      }
    });

All that's left is to create an instance of the <tt>App</tt>, and provide it a container to live in. The whole thing clocks in at about <b>50 lines</b> (including whitespace and comments)!

    // You will want to run these in a DOMReady handler.
    var el = document.getElementById('game');
    var game = new Game(el);

You can find complete examples in the <tt>test</tt> folder. A minified version of the library can be found in the build folder.

