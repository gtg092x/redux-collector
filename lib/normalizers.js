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
  var index = action.index;
  var after = action.after;
  var range = action.range;

  var rest = _objectWithoutProperties(action, ['skip', 'limit', 'index', 'after', 'range']);

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
  return _extends({ skip: toSkip, limit: toLimit }, rest);
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
//# sourceMappingURL=data:application/json;base64,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ckIsRUFBeUI7QUFDdkIsU0FBTyxpQkFBRSxRQUFGLENBQVcsRUFBWCxJQUNILEVBQUMsT0FBTyxFQUFSLEVBREcsR0FFSCxpQkFBRSxPQUFGLENBQVUsRUFBVixJQUNBLEVBQUMsT0FBTyxFQUFSLEVBREEsR0FFQSxFQUpKO0FBS0Q7O1FBR08sYyxHQUFBLGM7UUFBZ0IsaUIsR0FBQSxpQjtRQUFtQixrQixHQUFBLGtCO1FBQW9CLGUsR0FBQSxlO1FBQWlCLGEsR0FBQSxhO1FBQWUsVyxHQUFBLFciLCJmaWxlIjoibm9ybWFsaXplcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQge3NvcnRBbGlhc2VzfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge2NvbnRhaW5zLCBjbGFtcH0gZnJvbSAnLi9saWInO1xuXG5mdW5jdGlvbiBub3JtYWxpemVPcmRlcihvcmRlckFyZykge1xuICBjb25zdCBvcmRlciA9IF8uaXNTdHJpbmcob3JkZXJBcmcpXG4gICAgPyBvcmRlckFyZy50b0xvd2VyQ2FzZSgpXG4gICAgOiBvcmRlckFyZztcbiAgaWYgKGNvbnRhaW5zKHNvcnRBbGlhc2VzLmRlc2MsIG9yZGVyQXJnKSkge1xuICAgIHJldHVybiAnZGVzYyc7XG4gIH1cbiAgaWYgKGNvbnRhaW5zKHNvcnRBbGlhc2VzLmFzYywgb3JkZXJBcmcpKSB7XG4gICAgcmV0dXJuICdhc2MnO1xuICB9XG4gIHJldHVybiBvcmRlcjtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplU29ydEFyZ3Moe3NvcnQsIG9yZGVycywgb3JkZXIsIC4uLnJlc3R9KSB7XG5cbiAgaWYgKHNvcnQgPT09IHVuZGVmaW5lZCAmJiBvcmRlcnMgPT09IHVuZGVmaW5lZCAmJiBvcmRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHJlc3Q7XG4gIH1cblxuICBpZiAoXy5pc1BsYWluT2JqZWN0KHNvcnQpKSB7XG4gICAgY29uc3QgW3NvcnRzLCBvcmRlcnNdID0gT2JqZWN0LmtleXMoc29ydCkucmVkdWNlKChbc29ydHMsIG9yZGVyc10sIGtleSkgPT4ge1xuICAgICAgY29uc3Qgb3JkZXJBcmcgPSBzb3J0W2tleV07XG4gICAgICByZXR1cm4gW1xuICAgICAgICBbLi4uc29ydHMsIGtleV0sXG4gICAgICAgIFsuLi5vcmRlcnMsIG5vcm1hbGl6ZU9yZGVyKG9yZGVyQXJnKV1cbiAgICAgIF07XG4gICAgfSwgW1tdLCBbXV0pO1xuICAgIHJldHVybiB7c29ydDogc29ydHMsIG9yZGVyczogb3JkZXJzLCAuLi5yZXN0fTtcbiAgfVxuXG4gIGNvbnN0IHRvT3JkZXIgPSBvcmRlcnMgPT09IHVuZGVmaW5lZFxuICAgID8gW29yZGVyXVxuICAgIDogb3JkZXJzO1xuICByZXR1cm4ge3NvcnQsIG9yZGVyczogdG9PcmRlci5tYXAobm9ybWFsaXplT3JkZXIpLCAuLi5yZXN0fTtcbn1cblxuZnVuY3Rpb24gaXNOb3RVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplSW5kZXhBcmdzKHtpbmRleGVzID0gW10sIGluZGV4LCByYW5nZXMgPSBbXSwgcmFuZ2UsIHF1ZXJpZXMgPSBbXSwgcXVlcnksIC4uLnJlc3R9KSB7XG5cbiAgcmV0dXJuIHtcbiAgICBpbmRleGVzOiBbaW5kZXgsIC4uLmluZGV4ZXNdLmZpbHRlcihpc05vdFVuZGVmaW5lZCksXG4gICAgcXVlcmllczogW3F1ZXJ5LCAuLi5xdWVyaWVzXS5maWx0ZXIoaXNOb3RVbmRlZmluZWQpLFxuICAgIHJhbmdlczogW3JhbmdlLCAuLi5yYW5nZXNdLmZpbHRlcihpc05vdFVuZGVmaW5lZCksXG4gICAgLi4ucmVzdFxuICB9O1xuXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUFjdGlvbihpbmRleE9mLCBzdGF0ZSwgYWN0aW9uKSB7XG4gIGNvbnN0IHtza2lwLCBsaW1pdCA9IHN0YXRlLmxlbmd0aCwgaW5kZXgsIGFmdGVyLCByYW5nZSwgLi4ucmVzdH0gPSBhY3Rpb247XG4gIGxldCB0b1NraXAgPSBza2lwO1xuICBsZXQgdG9MaW1pdCA9IGxpbWl0O1xuXG4gIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdG9MaW1pdCA9IDE7XG4gICAgdG9Ta2lwID0gY2xhbXAoc3RhdGUubGVuZ3RoLCBpbmRleCk7XG4gIH0gZWxzZSBpZiAocmFuZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IFtzdGFydCwgZW5kXSA9IHJhbmdlLm1hcChjbGFtcC5iaW5kKHVuZGVmaW5lZCwgc3RhdGUubGVuZ3RoKSk7XG4gICAgdG9MaW1pdCA9IGVuZCAtIHN0YXJ0O1xuICAgIHRvU2tpcCA9IHN0YXJ0O1xuICB9IGVsc2UgaWYgKGFmdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICB0b1NraXAgPSBpbmRleE9mKHN0YXRlLCBhZnRlciwgc2tpcCkgKyAxO1xuICB9XG4gIHJldHVybiB7c2tpcDogdG9Ta2lwLCBsaW1pdDogdG9MaW1pdCwgLi4ucmVzdH07XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUZyb20oZnJvbSkge1xuICByZXR1cm4gXy5pc051bWJlcihmcm9tKVxuICAgID8ge2luZGV4OiBmcm9tfVxuICAgIDogXy5pc0FycmF5KGZyb20pXG4gICAgPyBmcm9tLmxlbmd0aCA9PT0gMiA/IHtyYW5nZTogZnJvbX0gOiB7aW5kZXhlczogZnJvbX1cbiAgICA6IF8uaXNGdW5jdGlvbihmcm9tKSA/IHtxdWVyeTogZnJvbX0gOiBmcm9tO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVUbyh0bykge1xuICByZXR1cm4gXy5pc051bWJlcih0bylcbiAgICA/IHtpbmRleDogdG99XG4gICAgOiBfLmlzQXJyYXkodG8pXG4gICAgPyB7cmFuZ2U6IHRvfVxuICAgIDogdG87XG59XG5cblxuZXhwb3J0IHtub3JtYWxpemVPcmRlciwgbm9ybWFsaXplU29ydEFyZ3MsIG5vcm1hbGl6ZUluZGV4QXJncywgbm9ybWFsaXplQWN0aW9uLCBub3JtYWxpemVGcm9tLCBub3JtYWxpemVUb307XG4iXX0=