// @copyright 2013
// @author Adu Bhandaru
// The Game3 collision detector object.

// constants
Game3.COLLISIONS_GENERAL = 1;
Game3.COLLISIONS_SPHERES = 2;


Game3.Collisions = Game3.Class.extend({

  init: function(models, type) {
    // options
    this.models = models || [ ];
    // figure out which check function to use
    type = (type !== undefined) ? type : Game3.COLLISIONS_GENERAL;
    switch (type) {
      case Game3.COLLISIONS_GENERAL:
        this.checkFn = this._check; break;
      case Game3.COLLISIONS_SPHERES:
        this.checkFn = this._checkSphere; break;
      default:
        this.checkFn = this._check;
    }
  },


  track: function(model) {
    this.models.push(model);
  },


  /**
   * Checks for all collisions in the models list.
   * TODO: This could be more efficient.
   * 1) The object list contains the object itself, which (correctly) does
   * not return a collision. But why do this check anyways?
   * 2) If A and B intersect, A does the check, then B does the check.
   * Note, the cases are not entirely symmetrical.
   * See: http://stackoverflow.com/a/12264206/408940
   */
  check: function() {
    for (var i = 0; i < this.models.length - 1; i++) {
      for (var j = i + 1; j < this.models.length; j++) {
        var modelA = this.models[i];
        var modelB = this.models[j];
        var meshA = modelA.getMesh();
        var meshB = modelB.getMesh();
        var collisionA = this.checkFn(meshA, meshB);
        var collisionB = this.checkFn(meshB, meshA);
        if (collisionA && collisionB) {
          this._sendCollision(modelA, collisionA);
          this._sendCollision(modelB, collisionB);
        }
      }
    }
  },


  /**
   * Generalized check intersection function.
   * See: http://stackoverflow.com/a/12264206/408940
   * @param {THREE.Mesh} mesh Object to check against.
   * @return {Game3.Collision} collisions A list of collisions.
   */
  _check: function(meshA, meshB) {
    var collision = null;
    var err = 10;
    // iterate through all the verticies.
    meshA.geometry.vertices.some(function(vertex) {
      var globalVertex = vertex.clone().applyProjection(meshA.matrix);
      var direction = globalVertex.sub(meshA.position);
      var dist = direction.length();
      // create ray and test intersections
      var ray = new THREE.Raycaster(
        meshA.position, direction.clone().normalize(), 0, dist + err);
      var intersects = ray.intersectObject(meshB);
      if (intersects.length > 0 &&
          intersects[0].distance < dist) {
        collision = this._getCollision(direction, intersects[0]);
        return true;
      }
    }, this);
    // clean up
    return collision;
  },


  _checkSphere: function(sphereA, sphereB) {
    var radiusA = sphereA.geometry.radius;
    var radiusB = sphereB.geometry.radius;
    var distance = sphereB.position.clone().sub(sphereA.position);
    var difference = distance.length() - (radiusA + radiusB);
    if (difference < 0) {
      var unit = distance.normalize();
      var point = unit.clone().multiplyScalar(radiusA).add(sphereA.position);
      var normal = unit.clone().negate();
      var correction = unit.clone().multiplyScalar(difference / 2);
      return new Game3.Collision({
        point: point,
        face: null,
        normal: normal,
        correction: correction,
        mesh: sphereB,
        other: sphereB.Game3Model
      });
    }
    return null;
  },


  _sendCollision: function(model, collisions) {
    // send the collision event to the handler
    var handler = model.collision;
    if (handler && typeof handler == 'function') {
      handler.apply(model, [collisions]);
      return true;
    }
    return false;
  },


  _getCollision: function(direction, intersection) {
    var difference = intersection.distance - direction.length();
    var correction = direction.clone().normalize().multiplyScalar(difference/2);
    return new Game3.Collision({
      point: intersection.point,
      face: intersection.face,
      mesh: intersection.object,
      other: intersection.object.Game3Model,
      correction: correction
    });
  }
});
