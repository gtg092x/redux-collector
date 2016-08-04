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

function matcherWrap(fn, _ref7) {
  var item = _ref7.item;

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return fn.call.apply(fn, [this, item].concat(args));
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
//# sourceMappingURL=data:application/json;base64,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QUFjLGUsR0FBQSxlO1FBQWlCLG1CLEdBQUEsbUI7UUFBcUIsVSxHQUFBLFU7UUFBWSxhLEdBQUEsYSIsImZpbGUiOiJsaWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuZnVuY3Rpb24gY2xhbXAocmFuZ2UsIGluZGV4QXJnKSB7XG4gIGxldCBpbmRleCA9IGluZGV4QXJnIDwgMFxuICAgID8gaW5kZXhBcmcgKyByYW5nZVxuICAgIDogaW5kZXhBcmc7XG5cbiAgcmV0dXJuIE1hdGgubWF4KE1hdGgubWluKGluZGV4LCByYW5nZSksIDApO1xufVxuXG5mdW5jdGlvbiBjb250YWlucyhhcnIsIHZhbCkge1xuICByZXR1cm4gXy5pbmRleE9mKGFyciwgdmFsKSA+IC0xO1xufVxuXG5cbmZ1bmN0aW9uIG1hcEluZGV4ZXMoYXJyKSB7XG4gIHJldHVybiBhcnIubWFwKChpdGVtLCBpbmRleCkgPT4gKHtpdGVtLCBpbmRleH0pKTtcbn1cblxuZnVuY3Rpb24gdW5NYXBJbmRleGVzKGFycikge1xuICByZXR1cm4gXy5zb3J0QnkoYXJyLCAnaW5kZXgnKS5tYXAoKHtpdGVtfSkgPT4gaXRlbSk7XG59XG5cbmZ1bmN0aW9uIHJlc3VsdFRyYW5zZm9ybSAocmVzdWx0KSB7XG4gIHJldHVybiB1bk1hcEluZGV4ZXMocmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gc29ydFJlc3VsdFRyYW5zZm9ybSAocmVzdWx0KSB7XG4gIHJldHVybiByZXN1bHQubWFwKCh7aXRlbX0pID0+IGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBhZGRXcmFwcGVyKGl0ZW0sIGluZGV4KSB7XG4gIHJldHVybiB7aXRlbSwgaW5kZXh9O1xufVxuXG5cblxuZnVuY3Rpb24gc29ydFRyYW5zZm9ybShzb3J0LCBvcmRlcikge1xuXG4gIGlmIChzb3J0ID09PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoXy5zaXplKG9yZGVyKSA9PT0gMCkge1xuICAgICAgcmV0dXJuICh7aXRlbSwgaW5kZXh9KSA9PiBpdGVtO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKHtpdGVtLCBpbmRleH0pID0+IGluZGV4O1xuICAgIH1cbiAgfVxuICBjb25zdCBzb3J0QXJyID0gXy5pc0FycmF5KHNvcnQpID8gc29ydCA6IFtzb3J0XTtcbiAgcmV0dXJuIHNvcnRBcnIubWFwKHNvcnRlciA9PiB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihzb3J0ZXIpKSB7XG4gICAgICByZXR1cm4gKHtpdGVtfSkgPT4gc29ydGVyKGl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gKHtpdGVtfSkgPT4gaXRlbVtzb3J0ZXJdO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcldyYXAgKGZuLCB7aXRlbX0sIC4uLmFyZ3MpIHtcbiAgcmV0dXJuIGZuLmNhbGwodGhpcywgaXRlbSwgLi4uYXJncyk7XG59XG5cblxuZXhwb3J0IHtjbGFtcCwgbWF0Y2hlcldyYXAsIGNvbnRhaW5zLCBtYXBJbmRleGVzLCB1bk1hcEluZGV4ZXMsIHJlc3VsdFRyYW5zZm9ybSwgc29ydFJlc3VsdFRyYW5zZm9ybSwgYWRkV3JhcHBlciwgc29ydFRyYW5zZm9ybX07XG4iXX0=