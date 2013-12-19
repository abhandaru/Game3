var Game = Game3.Game.extend({
  init: function(el) {
    // lights
    this.light = new Game3.Light(0xFFFFFF, new THREE.Vector3(400, 300, -400));

    // set up spheres
    var smallPos = new THREE.Vector3(-100, 0, 0);
    var smallVelocity = new THREE.Vector3(-10, 0, 0);
    var medPos = new THREE.Vector3(0, 100, 50);
    var medVelocity = new THREE.Vector3(0, -10, 0);
    var bigPos = new THREE.Vector3(100, 13, 0);
    var bigVelocity = new THREE.Vector3(10, 0, 0);

    // save references
    this.small = new Ball(this, 75, smallPos, smallVelocity);
    this.med = new Ball(this, 85, medPos, medVelocity);
    this.big = new Ball(this, 100, bigPos, bigVelocity);

    // track the collisions
    this.collisions = new Game3.Collisions(
        [this.small, this.med, this.big], Game3.COLLISIONS_SPHERES);

    // show objects
    this.add(this.small);
    this.add(this.med);
    this.add(this.big);
    this.add(this.light);
  },

  // gets called every timer fired
  timerfired: function() {
    this.collisions.check();
    this.big.timerfired();
    this.med.timerfired();
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
    this.mesh(this.ball);
  },

  timerfired: function() {
    if (this.ball.position.length() > 300)
      this.velocity.reflect(this.ball.position).negate();
    this.ball.position.add(this.velocity);
    // change colors
    var red = Math.floor(0xFF * ((this.ball.position.x + 350) / 700));
    var blue = 0xFF - red;
    var color = (red << 16) | blue;
    this.ball.material.color.setHex(color);
  },

  collision: function(collision) {
    this.ball.position.add(collision.correction());
    this.velocity.reflect(collision.normal()).negate();
  }
});
