var Game = Game3.Game.extend({
  init: function(el) {
    this.light = new Game3.Light(this, 0xFFFFFF, new THREE.Vector3(400, 300, -400));
    this.ball = new Ball(this);

    // set camera to the floor
    this.camera.position = new THREE.Vector3(0, 200, 0);
    this.camera.lookAt(this.ball.mesh.position);

    // show objects
    this.light.show();
    this.ball.show(true);
  },

  mousedrag: function(event) {
    var delta =  event.delta2D;
    this.camera.rotation.x += delta.x / 50;
    this.camera.rotation.y += -delta.y / 50;
  },

  scroll: function(event) {
    var dx = event.scrollDelta().x;
    var dy = event.scrollDelta().y;
    this.camera.translateZ(-dy/5);
    this.camera.translateX(-dx/5);
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
