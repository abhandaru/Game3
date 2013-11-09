var Game = Game3.Game.extend({
  init: function(el) {
    // make a cube and a light
    this.cube = new Cube(this);
    this.light = new Game3.Light(this, 0xFFFFFF, new THREE.Vector3(200, 150, -200));

    // show objects
    this.cube.show(true);
    this.light.show();
  },

  // gets called every timer fired
  animate: function() {
    this.cube.animate();
  }
});

var Cube = Game3.Model.extend({
  init: function(game) {
    // set up geometry
    var grey = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
    this.cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), grey);

    // set object
    this.setMesh(this.cube);
  },

  animate: function() {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.02;
  },

  mouseover: function(event) {
    var rand = Math.floor(Math.random() * 0xFFFFFF);
    this.cube.material.color.setHex(rand);
  },

  mouseout: function(event) {
    this.cube.material.color.setHex(0xCCCCCC);
  }
});
