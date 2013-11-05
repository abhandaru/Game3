var Game = G3.Game.extend({
  init: function(el) {
    this._super(el);

    // make a cube and a light
    this.cube = new Cube(this);
    this.light = new G3.Light(this, 0xFFFFFF, new THREE.Vector3(400, 300, -400));

    // show objects
    this.cube.show(true);
    this.light.show();
  }
});

var Cube = G3.Model.extend({
  init: function(game) {
    this._super(game);

    // set up geometry
    var grey = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
    this.cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), grey);

    // set object
    this.setMesh(this.cube);
  },

  mousedrag: function(event) {
    var dx = event.delta2D.x;
    var dy = event.delta2D.y;
    this.cube.position.x += 2*dx;
    this.cube.position.z += 2*dy;
  }
});
