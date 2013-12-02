var Game = Game3.Game.extend({
  init: function(el) {
    // make a cube and a light
    this.cube = new Cube(this);
    this.light = new Game3.Light(this, 0xFFFFFF, new THREE.Vector3(400, 300, -400));

    // show objects
    this.cube.show(true);
    this.light.show();
  },

  click: function(event) {
    console.log('left');
  },

  rightclick: function(event) {
    console.log('right');
  }

});

var Cube = Game3.Model.extend({
  init: function(game) {
    // set up geometry
    var grey = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
    this.cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), grey);

    // set object
    this.mesh(this.cube);
  },

  mousedrag: function(event) {
    var dx = event.delta2D.x;
    var dy = event.delta2D.y;
    this.cube.position.x += 2*dx;
    this.cube.position.z += 2*dy;
  },

  rightclick: function(event) {
    console.log('right cube');
    return false;
  }
});
