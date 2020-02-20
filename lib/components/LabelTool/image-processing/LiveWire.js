'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computePath = computePath;

var _Dijkstra = require('./Dijkstra');

var defaultMarkRadius = 1; // ~9 pixels per mark
function computePath(_ref) {
  var points = _ref.points,
      height = _ref.height,
      width = _ref.width,
      imageData = _ref.imageData,
      markRadius = _ref.markRadius;

  markRadius = markRadius === undefined ? defaultMarkRadius : markRadius;
  function pointToId(x, y) {
    return (height - y) * (width * 4) + x * 4;
  }

  function idToPoint(id) {
    var x = id % (width * 4) / 4;
    var y = height - Math.floor(id / (width * 4));
    return { x: x, y: y };
  }

  var pointsSets = points.map(function (_ref2) {
    var x = _ref2.x,
        y = _ref2.y;

    x = Math.floor(x);
    y = Math.floor(y);
    var points = [];
    for (var dx = -markRadius; dx <= markRadius; dx++) {
      for (var dy = -markRadius; dy <= markRadius; dy++) {
        var p = { x: x + dx, y: y + dy };
        if (inBounds(p, height, width)) {
          points.push(p);
        }
      }
    }
    return points;
  });

  var idsSets = pointsSets.map(function (ps) {
    return new Set(ps.map(function (_ref3) {
      var x = _ref3.x,
          y = _ref3.y;
      return pointToId(x, y);
    }));
  });

  var minPoint = void 0,
      maxPoint = void 0;

  function getPaths(startingSet, startingDistances, endSet) {
    minPoint = { x: Infinity, y: Infinity };
    maxPoint = { x: -Infinity, y: -Infinity };

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = endSet[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var id = _step.value;

        var p = idToPoint(id);
        minPoint.x = Math.min(minPoint.x, p.x);
        minPoint.y = Math.min(minPoint.y, p.y);
        maxPoint.x = Math.max(maxPoint.x, p.x);
        maxPoint.y = Math.max(maxPoint.y, p.y);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = startingSet[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _id = _step2.value;

        var _p = idToPoint(_id);
        minPoint.x = Math.min(minPoint.x, _p.x);
        minPoint.y = Math.min(minPoint.y, _p.y);
        maxPoint.x = Math.max(maxPoint.x, _p.x);
        maxPoint.y = Math.max(maxPoint.y, _p.y);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    minPoint.x -= 3;
    minPoint.y -= 3;
    maxPoint.x += 3;
    maxPoint.y += 3;

    function calcCost(a, b, c, d) {
      var sum = 0;
      for (var i = 0; i < 3; i++) {
        var aveA = (imageData[a + i] + imageData[b + i]) / 2;
        var aveB = (imageData[c + i] + imageData[d + i]) / 2;
        var diff = Math.abs(aveA - aveB);
        sum += diff * diff;
      }
      return sum;
    }

    var maxCost = 1000000;
    var distanceFn = function distanceFn(a, b) {
      var pa = idToPoint(a);
      var pb = idToPoint(b);

      if (pa.x === pb.x) {
        var pl1 = pointToId(pa.x - 1, pa.y);
        var pl2 = pointToId(pa.x - 1, pb.y);
        var pr1 = pointToId(pa.x + 1, pa.y);
        var pr2 = pointToId(pa.x + 1, pb.y);
        var cost = calcCost(pl1, pl2, pr1, pr2);
        return maxCost - cost;
      } else if (pa.y === pb.y) {
        var _pl = pointToId(pa.x, pa.y - 1);
        var _pl2 = pointToId(pb.x, pb.y - 1);
        var _pr = pointToId(pa.x, pa.y + 1);
        var _pr2 = pointToId(pb.x, pb.y + 1);
        var _cost = calcCost(_pl, _pl2, _pr, _pr2);
        return maxCost - _cost;
      } else {
        var p1 = pointToId(pa.x, pb.y);
        var p2 = pointToId(pb.x, pa.y);
        var _cost2 = calcCost(p1, p1, p2, p2);
        return maxCost - Math.floor(_cost2 / 1.414);
      }
    };

    var neighborsFn = function neighborsFn(id) {
      var p = idToPoint(id);
      var points = [];
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (!i && !j) continue;
          points.push({
            x: p.x + i,
            y: p.y + j
          });
        }
      }
      var validPoints = points.filter(function (p) {
        return inBounds(p, height, width);
      }).filter(function (p) {
        return p.x >= minPoint.x && p.x <= maxPoint.x && p.y >= minPoint.y && p.y <= maxPoint.y;
      });
      return validPoints.map(function (p) {
        return pointToId(p.x, p.y);
      });
    };

    return (0, _Dijkstra.dijkstra)(startingDistances, endSet, distanceFn, neighborsFn);
  }

  var prevDistances = new Map();
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = idsSets[0][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var id = _step3.value;
      prevDistances.set(id, 0);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  var pathsSets = [];

  idsSets.forEach(function (currentSet, i) {
    if (!i) return;
    var prevSet = idsSets[i - 1];
    var paths = getPaths(prevSet, prevDistances, currentSet);
    pathsSets.push(paths);
    prevDistances = new Map();
    paths.forEach(function (_ref4) {
      var id = _ref4.id,
          distance = _ref4.distance;
      return prevDistances.set(id, distance);
    });
  });

  var minDist = Infinity,
      pathId = void 0;
  pathsSets[pathsSets.length - 1].forEach(function (_ref5) {
    var id = _ref5.id,
        distance = _ref5.distance;

    if (minDist > distance) {
      minDist = distance;
      pathId = id;
    }
  });
  var totalPath = [];
  pathsSets.reverse();
  pathsSets.forEach(function (pathsSet) {
    var selectedPath = null;
    pathsSet.forEach(function (p) {
      if (p.id === pathId) {
        selectedPath = p;
      }
    });

    if (!selectedPath) {
      return;
    }

    totalPath = selectedPath.path.concat(totalPath);
    pathId = selectedPath.path[0];
  });

  return totalPath.map(function (id) {
    return idToPoint(id);
  });
}

function inBounds(p, height, width) {
  return p.x >= 0 && p.x < width && p.y >= 0 && p.y < height;
}