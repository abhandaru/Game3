var Game = Game3.Game.extend({
  init: function(el) {
    this.light = new Game3.Light(this, 0xFFFFFF, new THREE.Vector3(400, 300, -400));
    this.ball = new Ball(this);

    // show objects
    this.light.show();
    this.ball.show(true);
  },

  scroll: function(event) {
    this.camera.translateZ(event.scrollDelta().y);
  }
});

var Ball = Game3.Model.extend({
  init: function(game) {
    // set up geometry
    var grey = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
    this.ball = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), grey);
    // set object
    this.setMesh(this.ball);
  }
});
