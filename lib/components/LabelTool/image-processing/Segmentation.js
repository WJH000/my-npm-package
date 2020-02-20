"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.computeVectorized = computeVectorized;
var d = [[1, 0], [0, -1], [-1, 0], [0, 1]];
var DIR = {
  DOWN: 0,
  LEFT: 1,
  UP: 2,
  RIGHT: 3
};
// 2^4 mappings from mask to new direction after a possible turn
// assuming the wall is on the right in the current direction
var turnDirection = [-1, DIR.DOWN, DIR.RIGHT, DIR.RIGHT, DIR.UP, -1, DIR.UP, DIR.UP, DIR.LEFT, DIR.DOWN, -1, DIR.RIGHT, DIR.LEFT, DIR.DOWN, DIR.LEFT, -1];

function vectorize(start, used, matrix) {
  var n = used.length;
  var m = used[0].length;

  // mark everything with a bfs
  var q = [];
  q.push(start);

  var area = 0;
  for (var front = 0; front < q.length; front++) {
    var _cur = q[front];
    area++;
    for (var di = 0; di < d.length; di++) {
      var next = [_cur[0] + d[di][0], _cur[1] + d[di][1]];

      if (next[0] >= 0 && next[0] < n && next[1] >= 0 && next[1] < m && !used[next[0]][next[1]] && matrix[next[0]][next[1]] === matrix[start[0]][start[1]]) {
        used[next[0]][next[1]] = true;
        q.push(next);
      }
    }
  }

  // skip anything too small
  if (area < n * m * 0.002) {
    return null;
  }

  // assume that start is indeed the left-most element of the top-most row
  // belonging to the figure we are trying to vectorize
  var points = [start];
  var direction = DIR.RIGHT; // start moving right
  var cur = start;

  function getMask(pos) {
    var _pos = _slicedToArray(pos, 2),
        y = _pos[0],
        x = _pos[1];

    var _start = _slicedToArray(start, 2),
        sy = _start[0],
        sx = _start[1];

    var mask = 0;
    if (x > 0 && y > 0 && matrix[y - 1][x - 1] === matrix[sy][sx]) mask |= 1;
    mask <<= 1;

    if (y > 0 && x < m && matrix[y - 1][x] === matrix[sy][sx]) mask |= 1;
    mask <<= 1;

    if (y < n && x < m && matrix[y][x] === matrix[sy][sx]) mask |= 1;
    mask <<= 1;

    if (y < n && x > 0 && matrix[y][x - 1] === matrix[sy][sx]) mask |= 1;

    return mask;
  }

  while (true) {
    var _next = [cur[0] + d[direction][0], cur[1] + d[direction][1]];

    points.push(_next);
    if (_next[0] === start[0] && _next[1] === start[1]) break;

    var mask = getMask(_next);
    var nDirection = turnDirection[mask];

    if (nDirection === -1) {
      nDirection = (direction + 1) % 4;
    }

    direction = nDirection;
    cur = _next;
  }

  return points;
}

function computeVectorized(matrix) {
  var n = matrix.length;
  var m = matrix[0].length;

  var used = matrix.map(function (row) {
    return row.map(function () {
      return false;
    });
  });
  var vectors = [];

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      if (!used[i][j] && matrix[i][j] !== 0) vectors.push(vectorize([i, j], used, matrix));
    }
  }return vectors.filter(function (v) {
    return !!v;
  });
}