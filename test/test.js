var Game = G3.Game.extend({
  init: function(el) {
    this._super(el);

    // make a cube and a light
    var cube = new Cube(this);
    var light = new G3.Light(this, 0xFFFFFF, new THREE.Vector3(200, 150, -200));

    // show objects
    cube.show(true);
    light.show();
  }

});

var Cube = G3.Model.extend({
  init: function(game) {
    this._super(game);

    // set up geometry
    var grey = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
    var cube = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), grey);

    // set object
    this.setObject(cube);
  }
});
