var Game = Game3.Game.extend({
  init: function(el) {
    this._super(el);

    // make a ball and a light
    this.ball = new Ball(this);
    this.light = new Game3.Light(this, 0xFFFFFF, new THREE.Vector3(400, 300, -400));

    // show objects
    this.ball.show(true);
    this.light.show();
    this.start();
  },

  // gets called every timer fired
  animate: function() {
    this.ball.animate();
  }
});

var Ball = Game3.Model.extend({
  init: function(game) {
    this._super(game);

    // state
    this.dx = 4;

    // set up geometry
    var grey = new THREE.MeshLambertMaterial({color: 0xFF00FF});
    this.ball = new THREE.Mesh(new THREE.SphereGeometry(100, 32, 24), grey);

    // set object
    this.setMesh(this.ball);
  },

  animate: function() {
    if (this.ball.position.x > 200 || this.ball.position.x < -200)
      this.dx = -this.dx;
    this.ball.position.x += this.dx;
  }
});
