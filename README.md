    # Game3
    <p>
      Game3 (G3) is a JavaScript framework to write 3D apps using <a href="http://threejs.org/">ThreeJS</a>.
    </p>
    <p>
      The project is currently in it's infancy. The main problem with most ThreeJS apps is that there is a lot of exposed boilerplate code, and no consistent way to handle events with objects in the scene. Track this project on Github: <a href="https://github.com/abhandaru/Game3">Game3</a>
    </p>
    <h2>A Simple Example</h2>
    <p>
      Here is a simple example using the Game3 framework. By extending the provided base classes, it is easy to customize and override without exposing too much.
    </p>

    var App = G3.App.extend({
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

    <p>
      Declaring models and specifying how they'll be rendered is easy. Simply extend the base <tt>Model</tt> class, and only override or supply methods you need.
    </p>

    var Cube = G3.Model.extend({
      init: function(app) {
        this._super(app);

        // set up geometry
        var grey = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
        this.cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), grey);

        // set object
        this.setObject(this.cube);
      },

      animate: function() {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.02;
      },</code></pre>
        <p>Binding event handlers is simple. If you have provided a handler, it will be called transparently. All the projection math is done for you. In an MVC-like pattern, you can operate on the highest level app class from here.</p>
        <pre><code>  // Continuing to define Cube class.
      mouseover: function(event) {
        var rand = Math.floor(Math.random() * 0xFFFFFF);
        this.cube.material.color.setHex(rand);
      },

      mouseout: function(event) {
        this.cube.material.color.setHex(0xCCCCCC);
      }
    });

    <p>
      All that's left is to create an instance of the <tt>App</tt>, and provide it a container to live in. The whole thing clocks in at about <b>50 lines</b> (including whitespace and comments)!
    </p>

    &lt;script type="text/javascript"&gt;
      var el = document.getElementById('app');
      var app = new App(el);
    &lt;/script&gt;
