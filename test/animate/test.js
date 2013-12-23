var Game = Game3.Game.extend({
  init: function(el) {
    // make a model and a light
    this.model = new Model(this);

    // show objects
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
    var grey = new THREE.MeshNormalMaterial({color: 0xCCCCCC});
    this.geo = new THREE.Mesh(
        new THREE.IcosahedronGeometry(200, 1), grey);

    // set object
    this.mesh(this.geo);
  },

  update: function() {
    this.geo.rotation.x += 0.01;
    this.geo.rotation.y += 0.02;
  }
});
