'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortTransform = exports.addWrapper = exports.sortResultTransform = exports.resultTransform = exports.unMapIndexes = exports.mapIndexes = exports.contains = exports.matcherWrap = exports.clamp = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function clamp(range, indexArg) {
  var index = indexArg < 0 ? indexArg + range : indexArg;

  return Math.max(Math.min(index, range), 0);
}

function contains(arr, val) {
  return _lodash2.default.indexOf(arr, val) > -1;
}

function mapIndexes(arr) {
  return arr.map(function (item, index) {
    return { item: item, index: index };
  });
}

function unMapIndexes(arr) {
  return _lodash2.default.sortBy(arr, 'index').map(function (_ref) {
    var item = _ref.item;
    return item;
  });
}

function resultTransform(result) {
  return unMapIndexes(result);
}

function sortResultTransform(result) {
  return result.map(function (_ref2) {
    var item = _ref2.item;
    return item;
  });
}

function addWrapper(item, index) {
  return { item: item, index: index };
}

function sortTransform(sort, order) {

  if (sort === undefined) {
    if (_lodash2.default.size(order) === 0) {
      return function (_ref3) {
        var item = _ref3.item;
        var index = _ref3.index;
        return item;
      };
    } else {
      return function (_ref4) {
        var item = _ref4.item;
        var index = _ref4.index;
        return index;
      };
    }
  }
  var sortArr = _lodash2.default.isArray(sort) ? sort : [sort];
  return sortArr.map(function (sorter) {
    if (_lodash2.default.isFunction(sorter)) {
      return function (_ref5) {
        var item = _ref5.item;
        return sorter(item);
      };
    }
    return function (_ref6) {
      var item = _ref6.item;
      return item[sorter];
    };
  });
}

function matcherWrap(fn, _ref7, query) {
  var item = _ref7.item;
  var index = _ref7.index;

  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  return fn.call.apply(fn, [this, item, query, index].concat(args));
}

exports.clamp = clamp;
exports.matcherWrap = matcherWrap;
exports.contains = contains;
exports.mapIndexes = mapIndexes;
exports.unMapIndexes = unMapIndexes;
exports.resultTransform = resultTransform;
exports.sortResultTransform = sortResultTransform;
exports.addWrapper = addWrapper;
exports.sortTransform = sortTransform;
//# sourceMappingURL=data:application/json;base64,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LEdBQUEsSztRQUFPLFcsR0FBQSxXO1FBQWEsUSxHQUFBLFE7UUFBVSxVLEdBQUEsVTtRQUFZLFksR0FBQSxZO1FBQWMsZSxHQUFBLGU7UUFBaUIsbUIsR0FBQSxtQjtRQUFxQixVLEdBQUEsVTtRQUFZLGEsR0FBQSxhIiwiZmlsZSI6ImxpYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5mdW5jdGlvbiBjbGFtcChyYW5nZSwgaW5kZXhBcmcpIHtcbiAgbGV0IGluZGV4ID0gaW5kZXhBcmcgPCAwXG4gICAgPyBpbmRleEFyZyArIHJhbmdlXG4gICAgOiBpbmRleEFyZztcblxuICByZXR1cm4gTWF0aC5tYXgoTWF0aC5taW4oaW5kZXgsIHJhbmdlKSwgMCk7XG59XG5cbmZ1bmN0aW9uIGNvbnRhaW5zKGFyciwgdmFsKSB7XG4gIHJldHVybiBfLmluZGV4T2YoYXJyLCB2YWwpID4gLTE7XG59XG5cblxuZnVuY3Rpb24gbWFwSW5kZXhlcyhhcnIpIHtcbiAgcmV0dXJuIGFyci5tYXAoKGl0ZW0sIGluZGV4KSA9PiAoe2l0ZW0sIGluZGV4fSkpO1xufVxuXG5mdW5jdGlvbiB1bk1hcEluZGV4ZXMoYXJyKSB7XG4gIHJldHVybiBfLnNvcnRCeShhcnIsICdpbmRleCcpLm1hcCgoe2l0ZW19KSA9PiBpdGVtKTtcbn1cblxuZnVuY3Rpb24gcmVzdWx0VHJhbnNmb3JtIChyZXN1bHQpIHtcbiAgcmV0dXJuIHVuTWFwSW5kZXhlcyhyZXN1bHQpO1xufVxuXG5mdW5jdGlvbiBzb3J0UmVzdWx0VHJhbnNmb3JtIChyZXN1bHQpIHtcbiAgcmV0dXJuIHJlc3VsdC5tYXAoKHtpdGVtfSkgPT4gaXRlbSk7XG59XG5cbmZ1bmN0aW9uIGFkZFdyYXBwZXIoaXRlbSwgaW5kZXgpIHtcbiAgcmV0dXJuIHtpdGVtLCBpbmRleH07XG59XG5cblxuXG5mdW5jdGlvbiBzb3J0VHJhbnNmb3JtKHNvcnQsIG9yZGVyKSB7XG5cbiAgaWYgKHNvcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChfLnNpemUob3JkZXIpID09PSAwKSB7XG4gICAgICByZXR1cm4gKHtpdGVtLCBpbmRleH0pID0+IGl0ZW07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoe2l0ZW0sIGluZGV4fSkgPT4gaW5kZXg7XG4gICAgfVxuICB9XG4gIGNvbnN0IHNvcnRBcnIgPSBfLmlzQXJyYXkoc29ydCkgPyBzb3J0IDogW3NvcnRdO1xuICByZXR1cm4gc29ydEFyci5tYXAoc29ydGVyID0+IHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHNvcnRlcikpIHtcbiAgICAgIHJldHVybiAoe2l0ZW19KSA9PiBzb3J0ZXIoaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiAoe2l0ZW19KSA9PiBpdGVtW3NvcnRlcl07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVyV3JhcCAoZm4sIHtpdGVtLCBpbmRleH0sIHF1ZXJ5LCAuLi5hcmdzKSB7XG4gIHJldHVybiBmbi5jYWxsKHRoaXMsIGl0ZW0sIHF1ZXJ5LCBpbmRleCwgLi4uYXJncyk7XG59XG5cblxuZXhwb3J0IHtjbGFtcCwgbWF0Y2hlcldyYXAsIGNvbnRhaW5zLCBtYXBJbmRleGVzLCB1bk1hcEluZGV4ZXMsIHJlc3VsdFRyYW5zZm9ybSwgc29ydFJlc3VsdFRyYW5zZm9ybSwgYWRkV3JhcHBlciwgc29ydFRyYW5zZm9ybX07XG4iXX0=