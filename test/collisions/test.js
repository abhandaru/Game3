var Game = Game3.Game.extend({
  init: function(el) {
    // lights
    this.light = new Game3.Light(this, 0xFFFFFF, new THREE.Vector3(400, 300, -400));

    // set up spheres
    var bigPos = new THREE.Vector3(100, 0, 0);
    var bigVelocity = new THREE.Vector3(4, 0, 0);
    var smallPos = new THREE.Vector3(-100, 0, 0);
    var smallVelocity = new THREE.Vector3(-4, 0, 0);
    this.big = new Ball(this, 100, bigPos, bigVelocity);
    this.small = new Ball(this, 75, smallPos, smallVelocity);

    // track the collisions
    this.collisions = new Game3.Collisions([this.big, this.small]);

    // show objects
    this.big.show();
    this.small.show();
    this.light.show();
  },

  // gets called every timer fired
  timerfired: function() {
    this.collisions.check();
    this.big.timerfired();
    this.small.timerfired();
  }
});

var Ball = Game3.Model.extend({
  init: function(game, radius, position, velocity) {
    // set up geometry
    var grey = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
    this.ball = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 24), grey);
    this.ball.position = position;
    this.velocity = velocity;
    // set object
    this.setMesh(this.ball);
  },

  timerfired: function() {
    if (this.ball.position.length() > 300)
      this.velocity.negate();
    this.ball.position.add(this.velocity);
  },

  collision: function(collision) {
    this.velocity.negate();
  }
});
