'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.dijkstra = dijkstra;

var _MaxHeap = require('./MaxHeap');

function dijkstra(startingDistances, endSet, distanceFn, neighborsFn) {
  var queue = new _MaxHeap.MinHeap(function (a, b) {
    return a - b;
  });
  var fromId = new Map();

  var finalDistances = new Map();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = startingDistances[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          _id = _step$value[0],
          _dist = _step$value[1];

      queue.set(_id, _dist);
      finalDistances.set(_id, _dist);
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

  var leftSet = new Set(endSet.entries());

  var _loop = function _loop() {
    var id = queue.minElementId();
    var dist = queue.get(id);
    queue.remove(id);

    if (leftSet.has(id)) {
      leftSet.delete(id);
    }

    neighborsFn(id).forEach(function (nid) {
      var ndist = finalDistances.has(nid) ? finalDistances.get(nid) : Infinity;
      var delta = distanceFn(id, nid);
      if (dist + delta <= ndist) {
        queue.set(nid, dist + delta);
        finalDistances.set(nid, dist + delta);

        if (endSet.has(nid)) {
          leftSet.add(nid);
        }

        fromId.set(nid, id);
      }
    });
  };

  while (!queue.empty() && leftSet.size > 0) {
    _loop();
  }

  return Array.from(endSet).map(function (id) {
    var path = [];
    var curId = id;
    while (curId !== null) {
      path.push(curId);
      curId = fromId.has(curId) ? fromId.get(curId) : null;
    }

    return {
      id: id,
      path: path.reverse(),
      distance: finalDistances.get(id)
    };
  });
}