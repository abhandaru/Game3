var Game = Game3.Game.extend({
  init: function(el) {
    // make a model and a light
    this.light = new Game3.Light(0xFFFFFF, new THREE.Vector3(400, 300, -400));
    this.model = new Model(this);

    // show objects
    this.add(this.light);
    this.add(this.model);
  },

  // gets called every timer fired
  update: function(dt) {
    this.model.update();
  }
});

var Model = Game3.Model.extend({
  init: function(game) {
    // set up geometry
    this.load('tree.json', function(mesh) {
      var scale = 500;
      mesh.position = Game3.origin();
      mesh.position.y -= 100;
      mesh.scale.set(scale, scale, scale);
      this.geo = mesh;
      this.mesh(mesh);
    });
  },

  update: function() {
    if (!this.ready()) return;
    this.geo.rotation.y += 0.005;
  }
});
