var Game = G3.Game.extend({

  init: function(el) {
    this._super(el);

    // just make an object
    var grey = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
    var mat = grey;
    var white = grey;

    // Make a figurine.
    var unit = new THREE.Object3D();
    var base = new THREE.Mesh(new THREE.CylinderGeometry(0, 60, 100, 24, 1), mat);
    var face = new THREE.Mesh(new THREE.CylinderGeometry(20, 40, 33, 24, 1), white);
    var head = new THREE.Mesh(new THREE.CylinderGeometry(0, 30, 50, 24, 1), grey);
    var foot = new THREE.Mesh(new THREE.CylinderGeometry(20, 35, 15, 12, 1), white);
    base.position.y += 60;
    face.position.y += 80;
    head.position.y += 100;
    foot.position.y += 20;
    foot.position.x += 30;

    // Put it together.
    unit.add(base);
    unit.add(face);
    unit.add(head);
    unit.add(foot);

    // add to the scene
    this.scene.add(unit);
  }

});