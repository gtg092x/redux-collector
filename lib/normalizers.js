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

    toLimit = end + 1 - start;
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
  return _lodash2.default.isNumber(from) ? { index: from } : _lodash2.default.isArray(from) ? { indexes: from } : _lodash2.default.isFunction(from) ? { query: from } : from;
}

function normalizeTo(to) {

  if (_lodash2.default.isArray(to)) {
    throw '[Redux Collector] `to` must be a single index. You passed: ' + to;
  }

  return _lodash2.default.isNumber(to) ? { index: to } : _lodash2.default.isFunction(to) ? { query: to } : to;
}

exports.normalizeOrder = normalizeOrder;
exports.normalizeSortArgs = normalizeSortArgs;
exports.normalizeIndexArgs = normalizeIndexArgs;
exports.normalizeAction = normalizeAction;
exports.normalizeFrom = normalizeFrom;
exports.normalizeTo = normalizeTo;
//# sourceMappingURL=data:application/json;base64,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QixJQUF2QixFQUE2QjtBQUMzQixTQUFPLGlCQUFFLFFBQUYsQ0FBVyxJQUFYLElBQ0gsRUFBQyxPQUFPLElBQVIsRUFERyxHQUVILGlCQUFFLE9BQUYsQ0FBVSxJQUFWLElBQ0UsRUFBQyxTQUFTLElBQVYsRUFERixHQUVFLGlCQUFFLFVBQUYsQ0FBYSxJQUFiLElBQ0UsRUFBQyxPQUFPLElBQVIsRUFERixHQUVFLElBTlI7QUFPRDs7QUFFRCxTQUFTLFdBQVQsQ0FBcUIsRUFBckIsRUFBeUI7O0FBRXZCLE1BQUksaUJBQUUsT0FBRixDQUFVLEVBQVYsQ0FBSixFQUFtQjtBQUNqQixVQUFNLGdFQUFnRSxFQUF0RTtBQUNEOztBQUVELFNBQU8saUJBQUUsUUFBRixDQUFXLEVBQVgsSUFDSCxFQUFDLE9BQU8sRUFBUixFQURHLEdBRUgsaUJBQUUsVUFBRixDQUFhLEVBQWIsSUFDRSxFQUFDLE9BQU8sRUFBUixFQURGLEdBRUUsRUFKTjtBQUtEOztRQUdPLGMsR0FBQSxjO1FBQWdCLGlCLEdBQUEsaUI7UUFBbUIsa0IsR0FBQSxrQjtRQUFvQixlLEdBQUEsZTtRQUFpQixhLEdBQUEsYTtRQUFlLFcsR0FBQSxXIiwiZmlsZSI6Im5vcm1hbGl6ZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHtzb3J0QWxpYXNlc30gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtjb250YWlucywgY2xhbXB9IGZyb20gJy4vbGliJztcblxuZnVuY3Rpb24gbm9ybWFsaXplT3JkZXIob3JkZXJBcmcpIHtcbiAgY29uc3Qgb3JkZXIgPSBfLmlzU3RyaW5nKG9yZGVyQXJnKVxuICAgID8gb3JkZXJBcmcudG9Mb3dlckNhc2UoKVxuICAgIDogb3JkZXJBcmc7XG4gIGlmIChjb250YWlucyhzb3J0QWxpYXNlcy5kZXNjLCBvcmRlckFyZykpIHtcbiAgICByZXR1cm4gJ2Rlc2MnO1xuICB9XG4gIGlmIChjb250YWlucyhzb3J0QWxpYXNlcy5hc2MsIG9yZGVyQXJnKSkge1xuICAgIHJldHVybiAnYXNjJztcbiAgfVxuICByZXR1cm4gb3JkZXI7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNvcnRBcmdzKHtzb3J0LCBvcmRlcnMsIG9yZGVyLCAuLi5yZXN0fSkge1xuXG4gIGlmIChzb3J0ID09PSB1bmRlZmluZWQgJiYgb3JkZXJzID09PSB1bmRlZmluZWQgJiYgb3JkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiByZXN0O1xuICB9XG5cbiAgaWYgKF8uaXNQbGFpbk9iamVjdChzb3J0KSkge1xuICAgIGNvbnN0IFtzb3J0cywgb3JkZXJzXSA9IE9iamVjdC5rZXlzKHNvcnQpLnJlZHVjZSgoW3NvcnRzLCBvcmRlcnNdLCBrZXkpID0+IHtcbiAgICAgIGNvbnN0IG9yZGVyQXJnID0gc29ydFtrZXldO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgWy4uLnNvcnRzLCBrZXldLFxuICAgICAgICBbLi4ub3JkZXJzLCBub3JtYWxpemVPcmRlcihvcmRlckFyZyldXG4gICAgICBdO1xuICAgIH0sIFtbXSwgW11dKTtcbiAgICByZXR1cm4ge3NvcnQ6IHNvcnRzLCBvcmRlcnM6IG9yZGVycywgLi4ucmVzdH07XG4gIH1cblxuICBjb25zdCB0b09yZGVyID0gb3JkZXJzID09PSB1bmRlZmluZWRcbiAgICA/IFtvcmRlcl1cbiAgICA6IG9yZGVycztcbiAgcmV0dXJuIHtzb3J0LCBvcmRlcnM6IHRvT3JkZXIubWFwKG5vcm1hbGl6ZU9yZGVyKSwgLi4ucmVzdH07XG59XG5cbmZ1bmN0aW9uIGlzTm90VW5kZWZpbmVkKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUluZGV4QXJncyh7aW5kZXhlcyA9IFtdLCBpbmRleCwgcmFuZ2VzID0gW10sIHJhbmdlLCBxdWVyaWVzID0gW10sIHF1ZXJ5LCAuLi5yZXN0fSkge1xuXG4gIHJldHVybiB7XG4gICAgaW5kZXhlczogW2luZGV4LCAuLi5pbmRleGVzXS5maWx0ZXIoaXNOb3RVbmRlZmluZWQpLFxuICAgIHF1ZXJpZXM6IFtxdWVyeSwgLi4ucXVlcmllc10uZmlsdGVyKGlzTm90VW5kZWZpbmVkKSxcbiAgICByYW5nZXM6IFtyYW5nZSwgLi4ucmFuZ2VzXS5maWx0ZXIoaXNOb3RVbmRlZmluZWQpLFxuICAgIC4uLnJlc3RcbiAgfTtcblxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVBY3Rpb24oaW5kZXhPZiwgc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7c2tpcCwgbGltaXQgPSBzdGF0ZS5sZW5ndGgsIGluZGV4ZXMsIGluZGV4LCBhZnRlciwgcmFuZ2UsIC4uLnJlc3R9ID0gYWN0aW9uO1xuICBsZXQgdG9Ta2lwID0gc2tpcDtcbiAgbGV0IHRvTGltaXQgPSBsaW1pdDtcblxuICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgIHRvTGltaXQgPSAxO1xuICAgIHRvU2tpcCA9IGNsYW1wKHN0YXRlLmxlbmd0aCwgaW5kZXgpO1xuICB9IGVsc2UgaWYgKHJhbmdlICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBbc3RhcnQsIGVuZF0gPSByYW5nZS5tYXAoY2xhbXAuYmluZCh1bmRlZmluZWQsIHN0YXRlLmxlbmd0aCkpO1xuICAgIHRvTGltaXQgPSAoZW5kICsgMSkgLSBzdGFydDtcbiAgICB0b1NraXAgPSBzdGFydDtcbiAgfSBlbHNlIGlmIChhZnRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdG9Ta2lwID0gaW5kZXhPZihzdGF0ZSwgYWZ0ZXIsIHNraXApICsgMTtcbiAgfVxuICBpZiAoaW5kZXhlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgcXVlcnkgPSByZXN0LnF1ZXJ5ID09PSB1bmRlZmluZWQgPyBbXSA6IFtyZXN0LnF1ZXJ5XTtcbiAgICByZXN0LnF1ZXJ5ID0gWy4uLnF1ZXJ5LCAoaXRlbSwgaW5kZXgpID0+IGNvbnRhaW5zKGluZGV4ZXMsIGluZGV4KV07XG4gIH1cbiAgcmV0dXJuIHtza2lwOiB0b1NraXAsIGluZGV4ZXMsIGxpbWl0OiB0b0xpbWl0LCAuLi5yZXN0fTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplRnJvbShmcm9tKSB7XG4gIHJldHVybiBfLmlzTnVtYmVyKGZyb20pXG4gICAgPyB7aW5kZXg6IGZyb219XG4gICAgOiBfLmlzQXJyYXkoZnJvbSlcbiAgICAgID8ge2luZGV4ZXM6IGZyb219XG4gICAgICA6IF8uaXNGdW5jdGlvbihmcm9tKVxuICAgICAgICA/IHtxdWVyeTogZnJvbX1cbiAgICAgICAgOiBmcm9tO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVUbyh0bykge1xuXG4gIGlmIChfLmlzQXJyYXkodG8pKSB7XG4gICAgdGhyb3cgJ1tSZWR1eCBDb2xsZWN0b3JdIGB0b2AgbXVzdCBiZSBhIHNpbmdsZSBpbmRleC4gWW91IHBhc3NlZDogJyArIHRvO1xuICB9XG5cbiAgcmV0dXJuIF8uaXNOdW1iZXIodG8pXG4gICAgPyB7aW5kZXg6IHRvfVxuICAgIDogXy5pc0Z1bmN0aW9uKHRvKVxuICAgICAgPyB7cXVlcnk6IHRvfVxuICAgICAgOiB0bztcbn1cblxuXG5leHBvcnQge25vcm1hbGl6ZU9yZGVyLCBub3JtYWxpemVTb3J0QXJncywgbm9ybWFsaXplSW5kZXhBcmdzLCBub3JtYWxpemVBY3Rpb24sIG5vcm1hbGl6ZUZyb20sIG5vcm1hbGl6ZVRvfTtcbiJdfQ==