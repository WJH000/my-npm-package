'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Heap implementation is adapted from:
// https://github.com/meteor/meteor/blob/devel/packages/binary-heap/max-heap.js
// Meteor is MIT licensed

// Constructor of Heap
// - comparator - Function - given two items returns a number
// - options:
//   - initData - Array - Optional - the initial data in a format:
//        Object:
//          - id - String - unique id of the item
//          - value - Any - the data value
//      each value is retained
//   - IdMap - Constructor - Optional - custom IdMap class to store id->index
//       mappings internally. Standard IdMap is used by default.
var MaxHeap = exports.MaxHeap = function () {
  function MaxHeap(comparator) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MaxHeap);

    if (typeof comparator !== 'function') {
      throw new Error('Passed comparator is invalid, should be a comparison function');
    }

    // a C-style comparator that is given two values and returns a number,
    // negative if the first value is less than the second, positive if the second
    // value is greater than the first and zero if they are equal.
    this._comparator = comparator;

    // _heapIdx maps an id to an index in the Heap array the corresponding value
    // is located on.
    this._heapIdx = new Map();

    // The Heap data-structure implemented as a 0-based contiguous array where
    // every item on index idx is a node in a complete binary tree. Every node can
    // have children on indexes idx*2+1 and idx*2+2, except for the leaves. Every
    // node has a parent on index (idx-1)/2;
    this._heap = [];

    // If the initial array is passed, we can build the heap in linear time
    // complexity (O(N)) compared to linearithmic time complexity (O(nlogn)) if
    // we push elements one by one.
    if (Array.isArray(options.initData)) {
      this._initFromData(options.initData);
    }
  }

  // Builds a new heap in-place in linear time based on passed data


  _createClass(MaxHeap, [{
    key: '_initFromData',
    value: function _initFromData(data) {
      var _this = this;

      this._heap = data.map(function (_ref) {
        var id = _ref.id,
            value = _ref.value;
        return { id: id, value: value };
      });

      data.forEach(function (_ref2, i) {
        var id = _ref2.id;
        return _this._heapIdx.set(id, i);
      });

      if (!data.length) {
        return;
      }

      // start from the first non-leaf - the parent of the last leaf
      for (var i = parentIdx(data.length - 1); i >= 0; i--) {
        this._downHeap(i);
      }
    }
  }, {
    key: '_downHeap',
    value: function _downHeap(idx) {
      while (leftChildIdx(idx) < this.size()) {
        var left = leftChildIdx(idx);
        var right = rightChildIdx(idx);
        var largest = idx;

        if (left < this.size()) {
          largest = this._maxIndex(largest, left);
        }

        if (right < this.size()) {
          largest = this._maxIndex(largest, right);
        }

        if (largest === idx) {
          break;
        }

        this._swap(largest, idx);
        idx = largest;
      }
    }
  }, {
    key: '_upHeap',
    value: function _upHeap(idx) {
      while (idx > 0) {
        var parent = parentIdx(idx);
        if (this._maxIndex(parent, idx) === idx) {
          this._swap(parent, idx);
          idx = parent;
        } else {
          break;
        }
      }
    }
  }, {
    key: '_maxIndex',
    value: function _maxIndex(idxA, idxB) {
      var valueA = this._get(idxA);
      var valueB = this._get(idxB);
      return this._comparator(valueA, valueB) >= 0 ? idxA : idxB;
    }

    // Internal: gets raw data object placed on idxth place in heap

  }, {
    key: '_get',
    value: function _get(idx) {
      return this._heap[idx].value;
    }
  }, {
    key: '_swap',
    value: function _swap(idxA, idxB) {
      var recA = this._heap[idxA];
      var recB = this._heap[idxB];

      this._heapIdx.set(recA.id, idxB);
      this._heapIdx.set(recB.id, idxA);

      this._heap[idxA] = recB;
      this._heap[idxB] = recA;
    }
  }, {
    key: 'get',
    value: function get(id) {
      return this.has(id) ? this._get(this._heapIdx.get(id)) : null;
    }
  }, {
    key: 'set',
    value: function set(id, value) {
      if (this.has(id)) {
        if (this.get(id) === value) {
          return;
        }

        var idx = this._heapIdx.get(id);
        this._heap[idx].value = value;

        // Fix the new value's position
        // Either bubble new value up if it is greater than its parent
        this._upHeap(idx);
        // or bubble it down if it is smaller than one of its children
        this._downHeap(idx);
      } else {
        this._heapIdx.set(id, this._heap.length);
        this._heap.push({ id: id, value: value });
        this._upHeap(this._heap.length - 1);
      }
    }
  }, {
    key: 'remove',
    value: function remove(id) {
      if (this.has(id)) {
        var last = this._heap.length - 1;
        var idx = this._heapIdx.get(id);

        if (idx !== last) {
          this._swap(idx, last);
          this._heap.pop();
          this._heapIdx.delete(id);

          // Fix the swapped value's position
          this._upHeap(idx);
          this._downHeap(idx);
        } else {
          this._heap.pop();
          this._heapIdx.delete(id);
        }
      }
    }
  }, {
    key: 'has',
    value: function has(id) {
      return this._heapIdx.has(id);
    }
  }, {
    key: 'empty',
    value: function empty() {
      return !this.size();
    }
  }, {
    key: 'clear',
    value: function clear() {
      this._heap = [];
      this._heapIdx = new Map();
    }

    // iterate over values in no particular order

  }, {
    key: 'forEach',
    value: function forEach(iterator) {
      this._heap.forEach(function (obj) {
        return iterator(obj.value, obj.id);
      });
    }
  }, {
    key: 'size',
    value: function size() {
      return this._heap.length;
    }
  }, {
    key: 'setDefault',
    value: function setDefault(id, def) {
      if (this.has(id)) {
        return this.get(id);
      }

      this.set(id, def);
      return def;
    }
  }, {
    key: 'maxElementId',
    value: function maxElementId() {
      return this.size() ? this._heap[0].id : null;
    }
  }, {
    key: '_selfCheck',
    value: function _selfCheck() {
      for (var i = 1; i < this._heap.length; i++) {
        if (this._maxIndex(parentIdx(i), i) !== parentIdx(i)) {
          throw new Error('An item with id ' + this._heap[i].id + ' has a parent younger than it: ' + this._heap[parentIdx(i)].id);
        }
      }
    }
  }]);

  return MaxHeap;
}();

var MinHeap = exports.MinHeap = function (_MaxHeap) {
  _inherits(MinHeap, _MaxHeap);

  function MinHeap(comparator, options) {
    _classCallCheck(this, MinHeap);

    return _possibleConstructorReturn(this, (MinHeap.__proto__ || Object.getPrototypeOf(MinHeap)).call(this, function (a, b) {
      return -comparator(a, b);
    }, options));
  }

  _createClass(MinHeap, [{
    key: 'maxElementId',
    value: function maxElementId() {
      throw new Error('Cannot call maxElementId on MinHeap');
    }
  }, {
    key: 'minElementId',
    value: function minElementId() {
      return _get2(MinHeap.prototype.__proto__ || Object.getPrototypeOf(MinHeap.prototype), 'maxElementId', this).call(this);
    }
  }]);

  return MinHeap;
}(MaxHeap);

var leftChildIdx = function leftChildIdx(i) {
  return i * 2 + 1;
};
var rightChildIdx = function rightChildIdx(i) {
  return i * 2 + 2;
};
var parentIdx = function parentIdx(i) {
  return i - 1 >> 1;
};