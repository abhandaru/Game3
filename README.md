# Game3

__Update__ – The [react-three-fiber](https://github.com/react-spring/react-three-fiber) project is amazing and should be preferred over this library. It has the same goals, much richer functionality, and a great community.

---

__Game3__ is a JavaScript framework to write 3D apps using <a href="http://threejs.org/">ThreeJS</a>.

The project is currently in it's infancy. The main problem with most ThreeJS apps is that there is a lot of exposed boilerplate code, and no consistent way to handle events with objects in the scene. Track this project on Github: <a href="https://github.com/abhandaru/Game3">Game3</a>

## Dependencies

You only need the following if you want to build (consolidate and minify) the library. You can edit, test, and contribute without any of this.

- <tt>make</tt> - We use GNU make as a command line tool.
- <tt>uglifyjs</tt> - We use a global UglifyJS install.


## Features
The project is young! We are a little feature light, but worth using and always growing.

- <tt>Game3.Class</tt> - Standard inheritance model.
- <tt>Game3.Game</tt> - Camera, renderer, and animation are all set up for you.
- <tt>Game3.Model</tt> - Bind handlers easily, add state to your scene objects.
- <tt>Game3.Event</tt> - Directly sent to your model/view, with rich metadata.
- <tt>Game3.Collision</tt> - A collision event with rich metadata.
- <tt>Game3.Collisions</tt> - Send your model/view collision events.
- <tt>this._super</tt> - Easy override and extension.
- Growing fast.


## Simple Example

Here is a simple example using the Game3 framework. First, add the library scripts to the <tt>&lt;head&gt;</tt> tag.

    <script type="text/javascript" src="three.min.js"></script>
    <script type="text/javascript" src="game3.min.js"></script>

By extending the provided base classes, it is easy to customize and override without exposing too much. During construction, run your own <tt>init</tt> function, and create/configure the objects you want.

    var Game = Game3.Game.extend({
      init: function(el) {
        // make a cube and a light
        this.light = new Game3.Light(0xFFFFFF, new THREE.Vector3(400, 300, -400));
        this.geo = new Model(this);

        // show objects
        this.add(this.geo);
        this.add(this.light);
      },

      // gets called every timer fired
      update: function(dt) {
        this.geo.update();
      }
    });

Declaring models and specifying how they'll be rendered is easy. Just extend the base <tt>Model</tt> class, and only override or supply methods you need. Additionally, binding event handlers is simple. If you have provided a handler, it will be called transparently. All the projection math is done for you. In an MVC-like pattern, you can operate on the highest level app class from here.

    var Model = Game3.Model.extend({
      init: function(game) {
        // set up geometry
        this.pause = false;
        this.geo = new THREE.Mesh(
            new THREE.IcosahedronGeometry(200, 1),
            new THREE.MeshNormalMaterial());
        // set object
        this.interactive = true;
        this.mesh(this.geo);
      },

      click: function(event) {
        this.pause = !this.pause;
      },

      update: function(dt) {
        if (this.pause) return;
        this.geo.rotation.x += 0.01;
        this.geo.rotation.y += 0.02;
      }
    });

All that's left is to create an instance of the <tt>App</tt>, and provide it a container to live in. The whole thing clocks in at about <b>50 lines</b> (including whitespace and comments)!

    // You will want to run these in a DOMReady handler.
    var el = document.getElementById('game');
    var game = new Game(el);

You can find complete examples in the <tt>test</tt> folder. A minified version of the library can be found in the build folder. Questions? Feel free to contact me or post an issue.

