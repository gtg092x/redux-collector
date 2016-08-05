'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeTo = exports.normalizeFrom = exports.normalizeAction = exports.normalizeIndexArgs = exports.normalizeSortArgs = exports.normalizeOrder = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _lib = require('./lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function normalizeOrder(orderArg) {
  var order = _lodash2.default.isString(orderArg) ? orderArg.toLowerCase() : orderArg;
  if ((0, _lib.contains)(_config.sortAliases.desc, orderArg)) {
    return 'desc';
  }
  if ((0, _lib.contains)(_config.sortAliases.asc, orderArg)) {
    return 'asc';
  }
  return order;
}

function normalizeSortArgs(_ref) {
  var sort = _ref.sort;
  var orders = _ref.orders;
  var order = _ref.order;

  var rest = _objectWithoutProperties(_ref, ['sort', 'orders', 'order']);

  if (sort === undefined && orders === undefined && order === undefined) {
    return rest;
  }

  if (_lodash2.default.isPlainObject(sort)) {
    var _Object$keys$reduce = Object.keys(sort).reduce(function (_ref2, key) {
      var _ref3 = _slicedToArray(_ref2, 2);

      var sorts = _ref3[0];
      var orders = _ref3[1];

      var orderArg = sort[key];
      return [[].concat(_toConsumableArray(sorts), [key]), [].concat(_toConsumableArray(orders), [normalizeOrder(orderArg)])];
    }, [[], []]);

    var _Object$keys$reduce2 = _slicedToArray(_Object$keys$reduce, 2);

    var sorts = _Object$keys$reduce2[0];
    var _orders = _Object$keys$reduce2[1];

    return _extends({ sort: sorts, orders: _orders }, rest);
  }

  var toOrder = orders === undefined ? [order] : orders;
  return _extends({ sort: sort, orders: toOrder.map(normalizeOrder) }, rest);
}

function isNotUndefined(val) {
  return val !== undefined;
}

function normalizeIndexArgs(_ref4) {
  var _ref4$indexes = _ref4.indexes;
  var indexes = _ref4$indexes === undefined ? [] : _ref4$indexes;
  var index = _ref4.index;
  var _ref4$ranges = _ref4.ranges;
  var ranges = _ref4$ranges === undefined ? [] : _ref4$ranges;
  var range = _ref4.range;
  var _ref4$queries = _ref4.queries;
  var queries = _ref4$queries === undefined ? [] : _ref4$queries;
  var query = _ref4.query;

  var rest = _objectWithoutProperties(_ref4, ['indexes', 'index', 'ranges', 'range', 'queries', 'query']);

  return _extends({
    indexes: [index].concat(_toConsumableArray(indexes)).filter(isNotUndefined),
    queries: [query].concat(_toConsumableArray(queries)).filter(isNotUndefined),
    ranges: [range].concat(_toConsumableArray(ranges)).filter(isNotUndefined)
  }, rest);
}

function normalizeAction(indexOf, state, action) {
  var skip = action.skip;
  var _action$limit = action.limit;
  var limit = _action$limit === undefined ? state.length : _action$limit;
  var indexes = action.indexes;
  var index = action.index;
  var after = action.after;
  var range = action.range;

  var rest = _objectWithoutProperties(action, ['skip', 'limit', 'indexes', 'index', 'after', 'range']);

  var toSkip = skip;
  var toLimit = limit;

  if (index !== undefined) {
    toLimit = 1;
    toSkip = (0, _lib.clamp)(state.length, index);
  } else if (range !== undefined) {
    var _range$map = range.map(_lib.clamp.bind(undefined, state.length));

    var _range$map2 = _slicedToArray(_range$map, 2);

    var start = _range$map2[0];
    var end = _range$map2[1];

    toLimit = end - start;
    toSkip = start;
  } else if (after !== undefined) {
    toSkip = indexOf(state, after, skip) + 1;
  }
  if (indexes !== undefined) {
    var query = rest.query === undefined ? [] : [rest.query];
    rest.query = [].concat(query, [function (item, index) {
      return (0, _lib.contains)(indexes, index);
    }]);
  }
  return _extends({ skip: toSkip, indexes: indexes, limit: toLimit }, rest);
}

function normalizeFrom(from) {
  return _lodash2.default.isNumber(from) ? { index: from } : _lodash2.default.isArray(from) ? from.length === 2 ? { range: from } : { indexes: from } : _lodash2.default.isFunction(from) ? { query: from } : from;
}

function normalizeTo(to) {
  return _lodash2.default.isNumber(to) ? { index: to } : _lodash2.default.isArray(to) ? { range: to } : to;
}

exports.normalizeOrder = normalizeOrder;
exports.normalizeSortArgs = normalizeSortArgs;
exports.normalizeIndexArgs = normalizeIndexArgs;
exports.normalizeAction = normalizeAction;
exports.normalizeFrom = normalizeFrom;
exports.normalizeTo = normalizeTo;
//# sourceMappingURL=data:application/json;base64,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QTZCO0FBQzNCLFNBQU8saUJBQUUsUUFBRixDQUFXLElBQVgsSUFDSCxFQUFDLE9BQU8sSUFBUixFQURHLEdBRUgsaUJBQUUsT0FBRixDQUFVLElBQVYsSUFDQSxLQUFLLE1BQUwsS0FBZ0IsQ0FBaEIsR0FBb0IsRUFBQyxPQUFPLElBQVIsRUFBcEIsR0FBb0MsRUFBQyxTQUFTLElBQVYsRUFEcEMsR0FFQSxpQkFBRSxVQUFGLENBQWEsSUFBYixJQUFxQixFQUFDLE9BQU8sSUFBUixFQUFyQixHQUFxQyxJQUp6QztBQUtEOztBQUVELFNBQVMsV0FBVCxDQUFxQixFQUFyQixFQUF5QjtBQUN2QixTQUFPLGlCQUFFLFFBQUYsQ0FBVyxFQUFYLElBQ0gsRUFBQyxPQUFPLEVBQVIsRUFERyxHQUVILGlCQUFFLE9BQUYsQ0FBVSxFQUFWLElBQ0EsRUFBQyxPQUFPLEVBQVIsRUFEQSxHQUVBLEVBSko7QUFLRDs7UUFHTyxjLEdBQUEsYztRQUFnQixpQixHQUFBLGlCO1FBQW1CLGtCLEdBQUEsa0I7UUFBb0IsZSxHQUFBLGU7UUFBaUIsYSxHQUFBLGE7UUFBZSxXLEdBQUEsVyIsImZpbGUiOiJub3JtYWxpemVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCB7c29ydEFsaWFzZXN9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7Y29udGFpbnMsIGNsYW1wfSBmcm9tICcuL2xpYic7XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU9yZGVyKG9yZGVyQXJnKSB7XG4gIGNvbnN0IG9yZGVyID0gXy5pc1N0cmluZyhvcmRlckFyZylcbiAgICA/IG9yZGVyQXJnLnRvTG93ZXJDYXNlKClcbiAgICA6IG9yZGVyQXJnO1xuICBpZiAoY29udGFpbnMoc29ydEFsaWFzZXMuZGVzYywgb3JkZXJBcmcpKSB7XG4gICAgcmV0dXJuICdkZXNjJztcbiAgfVxuICBpZiAoY29udGFpbnMoc29ydEFsaWFzZXMuYXNjLCBvcmRlckFyZykpIHtcbiAgICByZXR1cm4gJ2FzYyc7XG4gIH1cbiAgcmV0dXJuIG9yZGVyO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVTb3J0QXJncyh7c29ydCwgb3JkZXJzLCBvcmRlciwgLi4ucmVzdH0pIHtcblxuICBpZiAoc29ydCA9PT0gdW5kZWZpbmVkICYmIG9yZGVycyA9PT0gdW5kZWZpbmVkICYmIG9yZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gcmVzdDtcbiAgfVxuXG4gIGlmIChfLmlzUGxhaW5PYmplY3Qoc29ydCkpIHtcbiAgICBjb25zdCBbc29ydHMsIG9yZGVyc10gPSBPYmplY3Qua2V5cyhzb3J0KS5yZWR1Y2UoKFtzb3J0cywgb3JkZXJzXSwga2V5KSA9PiB7XG4gICAgICBjb25zdCBvcmRlckFyZyA9IHNvcnRba2V5XTtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIFsuLi5zb3J0cywga2V5XSxcbiAgICAgICAgWy4uLm9yZGVycywgbm9ybWFsaXplT3JkZXIob3JkZXJBcmcpXVxuICAgICAgXTtcbiAgICB9LCBbW10sIFtdXSk7XG4gICAgcmV0dXJuIHtzb3J0OiBzb3J0cywgb3JkZXJzOiBvcmRlcnMsIC4uLnJlc3R9O1xuICB9XG5cbiAgY29uc3QgdG9PcmRlciA9IG9yZGVycyA9PT0gdW5kZWZpbmVkXG4gICAgPyBbb3JkZXJdXG4gICAgOiBvcmRlcnM7XG4gIHJldHVybiB7c29ydCwgb3JkZXJzOiB0b09yZGVyLm1hcChub3JtYWxpemVPcmRlciksIC4uLnJlc3R9O1xufVxuXG5mdW5jdGlvbiBpc05vdFVuZGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVJbmRleEFyZ3Moe2luZGV4ZXMgPSBbXSwgaW5kZXgsIHJhbmdlcyA9IFtdLCByYW5nZSwgcXVlcmllcyA9IFtdLCBxdWVyeSwgLi4ucmVzdH0pIHtcblxuICByZXR1cm4ge1xuICAgIGluZGV4ZXM6IFtpbmRleCwgLi4uaW5kZXhlc10uZmlsdGVyKGlzTm90VW5kZWZpbmVkKSxcbiAgICBxdWVyaWVzOiBbcXVlcnksIC4uLnF1ZXJpZXNdLmZpbHRlcihpc05vdFVuZGVmaW5lZCksXG4gICAgcmFuZ2VzOiBbcmFuZ2UsIC4uLnJhbmdlc10uZmlsdGVyKGlzTm90VW5kZWZpbmVkKSxcbiAgICAuLi5yZXN0XG4gIH07XG5cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQWN0aW9uKGluZGV4T2YsIHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge3NraXAsIGxpbWl0ID0gc3RhdGUubGVuZ3RoLCBpbmRleGVzLCBpbmRleCwgYWZ0ZXIsIHJhbmdlLCAuLi5yZXN0fSA9IGFjdGlvbjtcbiAgbGV0IHRvU2tpcCA9IHNraXA7XG4gIGxldCB0b0xpbWl0ID0gbGltaXQ7XG5cbiAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICB0b0xpbWl0ID0gMTtcbiAgICB0b1NraXAgPSBjbGFtcChzdGF0ZS5sZW5ndGgsIGluZGV4KTtcbiAgfSBlbHNlIGlmIChyYW5nZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgW3N0YXJ0LCBlbmRdID0gcmFuZ2UubWFwKGNsYW1wLmJpbmQodW5kZWZpbmVkLCBzdGF0ZS5sZW5ndGgpKTtcbiAgICB0b0xpbWl0ID0gZW5kIC0gc3RhcnQ7XG4gICAgdG9Ta2lwID0gc3RhcnQ7XG4gIH0gZWxzZSBpZiAoYWZ0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgIHRvU2tpcCA9IGluZGV4T2Yoc3RhdGUsIGFmdGVyLCBza2lwKSArIDE7XG4gIH1cbiAgaWYgKGluZGV4ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gcmVzdC5xdWVyeSA9PT0gdW5kZWZpbmVkID8gW10gOiBbcmVzdC5xdWVyeV07XG4gICAgcmVzdC5xdWVyeSA9IFsuLi5xdWVyeSwgKGl0ZW0sIGluZGV4KSA9PiBjb250YWlucyhpbmRleGVzLCBpbmRleCldO1xuICB9XG4gIHJldHVybiB7c2tpcDogdG9Ta2lwLCBpbmRleGVzLCBsaW1pdDogdG9MaW1pdCwgLi4ucmVzdH07XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUZyb20oZnJvbSkge1xuICByZXR1cm4gXy5pc051bWJlcihmcm9tKVxuICAgID8ge2luZGV4OiBmcm9tfVxuICAgIDogXy5pc0FycmF5KGZyb20pXG4gICAgPyBmcm9tLmxlbmd0aCA9PT0gMiA/IHtyYW5nZTogZnJvbX0gOiB7aW5kZXhlczogZnJvbX1cbiAgICA6IF8uaXNGdW5jdGlvbihmcm9tKSA/IHtxdWVyeTogZnJvbX0gOiBmcm9tO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVUbyh0bykge1xuICByZXR1cm4gXy5pc051bWJlcih0bylcbiAgICA/IHtpbmRleDogdG99XG4gICAgOiBfLmlzQXJyYXkodG8pXG4gICAgPyB7cmFuZ2U6IHRvfVxuICAgIDogdG87XG59XG5cblxuZXhwb3J0IHtub3JtYWxpemVPcmRlciwgbm9ybWFsaXplU29ydEFyZ3MsIG5vcm1hbGl6ZUluZGV4QXJncywgbm9ybWFsaXplQWN0aW9uLCBub3JtYWxpemVGcm9tLCBub3JtYWxpemVUb307XG4iXX0=