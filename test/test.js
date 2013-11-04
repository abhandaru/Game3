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
    this.cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), grey);

    // set object
    this.setObject(this.cube);
  },

  mouseover: function(event) {
    this.cube.material.color.setHex(0xFF0000);
  },

  mouseout: function(event) {
    this.cube.material.color.setHex(0xCCCCCC);
  }
});
