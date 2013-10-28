var Game = G3.Game.extend({

  init: function(el) {
    this._super(el);

    // make a cube
    var grey = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
    var cube = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), grey);
    this.addDynamic(cube);

    // add a light
    var light = new THREE.PointLight(0xFFFFFF);
    light.position = new THREE.Vector3(200, 150, -200);
    this.addLight(light);
  }

});