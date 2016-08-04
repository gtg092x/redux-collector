'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lib = require('./lib');

var _defaultResolver = require('./default-resolver');

var _methodGenerators = require('./method-generators');

var _normalizers = require('./normalizers');

var _matchMethods = require('./match-methods');

var _collectorReducerBase = require('./collector-reducer-base');

var _collectorReducerBase2 = _interopRequireDefault(_collectorReducerBase);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function checkState(state) {
  if (!_lodash2.default.isArray(state)) {
    throw '[Redux Collector] - State ' + JSON.stringify(state) + ' is not an array. All collector reducers must be passed an array.';
  }
}

function generateCollector() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var matcherArg = _ref.matcher;
  var indexOfArg = _ref.indexOf;
  var indexesOfArg = _ref.indexesOf;
  var sortByArg = _ref.sortBy;

  var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref2$reducer = _ref2.reducer;
  var itemReducer = _ref2$reducer === undefined ? _lodash2.default.identity : _ref2$reducer;
  var itemDefault = _ref2.itemDefault;


  var matcherConfig = matcherArg === undefined ? _defaultResolver.defaultMatcher : _lodash2.default.partialRight(matcherArg, _defaultResolver.defaultMatcher);

  // Matcher Methods
  var matcher = _lodash2.default.wrap(matcherConfig, _lib.matcherWrap);
  var indexesOf = indexesOfArg || (0, _methodGenerators.generateIndexesOf)(matcher);
  var indexOf = indexOfArg || (0, _methodGenerators.generateIndexof)(indexesOf);
  var sortBy = sortByArg || _lodash2.default.orderBy;
  var normalizeAction = _normalizers.normalizeAction.bind(this, indexOf);

  // Argument Transforms
  function sortIfArg(state, action) {
    var _normalizeSortArgs = (0, _normalizers.normalizeSortArgs)(action);

    var sort = _normalizeSortArgs.sort;
    var orders = _normalizeSortArgs.orders;

    if (sort !== undefined || orders !== undefined) {
      var result = sortBy(state, (0, _lib.sortTransform)(sort, orders), orders);
      return result;
    }
    return state;
  }

  function argTransform(result, action) {
    return (0, _lodash2.default)(result).thru(_lodash2.default.partialRight(_lib.mapIndexes, action)).thru(_lodash2.default.partialRight(sortIfArg, action)).value();
  }

  // Reducer Transforms
  function collectionReducerWrap(reducer, state, actionArgs) {
    checkState(state);
    var stateArg = argTransform(state, actionArgs);
    var action = normalizeAction(stateArg, actionArgs);

    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    var result = reducer.call.apply(reducer, [this, stateArg, action].concat(args));
    return (0, _lib.resultTransform)(result, action);
  }

  function sortReducerWrap(reducer, state, action) {
    checkState(state);
    var stateArg = argTransform(state, action);

    for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      args[_key2 - 3] = arguments[_key2];
    }

    var result = reducer.call.apply(reducer, [this, stateArg, action].concat(args));
    return (0, _lib.sortResultTransform)(result, action);
  }

  function itemReducerWrap(fn, _ref3) {
    var item = _ref3.item;
    var index = _ref3.index;

    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }

    var result = fn.apply(undefined, [item].concat(args));
    return { item: result, index: index };
  }

  // Matcher methods
  var getIndexes = _matchMethods.getIndexesBase.bind(this, indexesOf);
  var getMoveIndexes = _matchMethods.getMoveIndexesBase.bind(this, indexesOf);

  var collectorObject = (0, _collectorReducerBase2.default)({
    itemDefault: itemDefault,
    matcher: matcher,
    getIndexes: getIndexes,
    getMoveIndexes: getMoveIndexes,
    addWrapper: _lib.addWrapper,
    reducer: _lodash2.default.wrap(itemReducer, itemReducerWrap),
    sortBy: sortBy
  });

  return Object.keys(collectorObject).reduce(function (pointer, key) {

    if ((0, _lib.contains)(_config.sortReducers, key)) {
      return _extends({}, pointer, _defineProperty({}, key, _lodash2.default.wrap(collectorObject[key], sortReducerWrap)));
    }

    return _extends({}, pointer, _defineProperty({}, key, _lodash2.default.wrap(collectorObject[key], collectionReducerWrap)));
  }, {});
}

exports.default = generateCollector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb2xsZWN0b3ItcmVkdWNlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUVBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVMsVUFBVCxDQUFxQixLQUFyQixFQUE0QjtBQUMxQixNQUFJLENBQUMsaUJBQUUsT0FBRixDQUFVLEtBQVYsQ0FBTCxFQUF1QjtBQUNyQix5Q0FBbUMsS0FBSyxTQUFMLENBQWUsS0FBZixDQUFuQztBQUNEO0FBQ0Y7O0FBRUQsU0FBUyxpQkFBVCxHQUErSztBQUFBLG1FQUEzRCxFQUEyRDs7QUFBQSxNQUExSSxVQUEwSSxRQUFuSixPQUFtSjtBQUFBLE1BQXJILFVBQXFILFFBQTlILE9BQThIO0FBQUEsTUFBOUYsWUFBOEYsUUFBekcsU0FBeUc7QUFBQSxNQUF4RSxTQUF3RSxRQUFoRixNQUFnRjs7QUFBQSxvRUFBSixFQUFJOztBQUFBLDRCQUF0RCxPQUFzRDtBQUFBLE1BQTdDLFdBQTZDLGlDQUEvQixpQkFBRSxRQUE2QjtBQUFBLE1BQW5CLFdBQW1CLFNBQW5CLFdBQW1COzs7QUFFN0ssTUFBTSxnQkFBZ0IsZUFBZSxTQUFmLHFDQUE0QyxpQkFBRSxZQUFGLENBQWUsVUFBZixrQ0FBbEU7OztBQUdBLE1BQU0sVUFBVSxpQkFBRSxJQUFGLENBQU8sYUFBUCxtQkFBaEI7QUFDQSxNQUFNLFlBQVksZ0JBQWdCLHlDQUFrQixPQUFsQixDQUFsQztBQUNBLE1BQU0sVUFBVSxjQUFjLHVDQUFnQixTQUFoQixDQUE5QjtBQUNBLE1BQU0sU0FBUyxhQUFhLGlCQUFFLE9BQTlCO0FBQ0EsTUFBTSxrQkFBa0IsNkJBQW9CLElBQXBCLENBQXlCLElBQXpCLEVBQStCLE9BQS9CLENBQXhCOzs7QUFJQSxXQUFTLFNBQVQsQ0FBb0IsS0FBcEIsRUFBMkIsTUFBM0IsRUFBbUM7QUFBQSw2QkFDVixvQ0FBa0IsTUFBbEIsQ0FEVTs7QUFBQSxRQUMx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a0JBRWMsaUIiLCJmaWxlIjoiY29sbGVjdG9yLXJlZHVjZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7Y29udGFpbnMsIG1hdGNoZXJXcmFwLCBtYXBJbmRleGVzLCByZXN1bHRUcmFuc2Zvcm0sIHNvcnRSZXN1bHRUcmFuc2Zvcm0sIGFkZFdyYXBwZXIsIHNvcnRUcmFuc2Zvcm19IGZyb20gJy4vbGliJztcblxuaW1wb3J0IHtkZWZhdWx0TWF0Y2hlcn0gZnJvbSAnLi9kZWZhdWx0LXJlc29sdmVyJztcbmltcG9ydCB7Z2VuZXJhdGVJbmRleGVzT2YsIGdlbmVyYXRlSW5kZXhvZn0gZnJvbSAnLi9tZXRob2QtZ2VuZXJhdG9ycyc7XG5cbmltcG9ydCB7bm9ybWFsaXplU29ydEFyZ3MsIG5vcm1hbGl6ZUFjdGlvbiBhcyBub3JtYWxpemVBY3Rpb25CYXNlfSBmcm9tICcuL25vcm1hbGl6ZXJzJztcbmltcG9ydCB7Z2V0SW5kZXhlc0Jhc2UsIGdldE1vdmVJbmRleGVzQmFzZX0gZnJvbSAnLi9tYXRjaC1tZXRob2RzJztcbmltcG9ydCBjb2xsZWN0b3JSZWR1Y2VyQmFzZSBmcm9tICcuL2NvbGxlY3Rvci1yZWR1Y2VyLWJhc2UnO1xuaW1wb3J0IHtzb3J0UmVkdWNlcnN9IGZyb20gJy4vY29uZmlnJztcblxuZnVuY3Rpb24gY2hlY2tTdGF0ZSAoc3RhdGUpIHtcbiAgaWYgKCFfLmlzQXJyYXkoc3RhdGUpKSB7XG4gICAgdGhyb3cgYFtSZWR1eCBDb2xsZWN0b3JdIC0gU3RhdGUgJHtKU09OLnN0cmluZ2lmeShzdGF0ZSl9IGlzIG5vdCBhbiBhcnJheS4gQWxsIGNvbGxlY3RvciByZWR1Y2VycyBtdXN0IGJlIHBhc3NlZCBhbiBhcnJheS5gO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ29sbGVjdG9yKHttYXRjaGVyOiBtYXRjaGVyQXJnLCBpbmRleE9mOiBpbmRleE9mQXJnLCBpbmRleGVzT2Y6IGluZGV4ZXNPZkFyZywgc29ydEJ5OiBzb3J0QnlBcmd9ID0ge30sIHtyZWR1Y2VyOiBpdGVtUmVkdWNlciA9IF8uaWRlbnRpdHksIGl0ZW1EZWZhdWx0fSA9IHt9KSB7XG5cbiAgY29uc3QgbWF0Y2hlckNvbmZpZyA9IG1hdGNoZXJBcmcgPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRNYXRjaGVyIDogXy5wYXJ0aWFsUmlnaHQobWF0Y2hlckFyZywgZGVmYXVsdE1hdGNoZXIpO1xuXG4gIC8vIE1hdGNoZXIgTWV0aG9kc1xuICBjb25zdCBtYXRjaGVyID0gXy53cmFwKG1hdGNoZXJDb25maWcsIG1hdGNoZXJXcmFwKTtcbiAgY29uc3QgaW5kZXhlc09mID0gaW5kZXhlc09mQXJnIHx8IGdlbmVyYXRlSW5kZXhlc09mKG1hdGNoZXIpO1xuICBjb25zdCBpbmRleE9mID0gaW5kZXhPZkFyZyB8fCBnZW5lcmF0ZUluZGV4b2YoaW5kZXhlc09mKTtcbiAgY29uc3Qgc29ydEJ5ID0gc29ydEJ5QXJnIHx8IF8ub3JkZXJCeTtcbiAgY29uc3Qgbm9ybWFsaXplQWN0aW9uID0gbm9ybWFsaXplQWN0aW9uQmFzZS5iaW5kKHRoaXMsIGluZGV4T2YpO1xuXG5cbiAgLy8gQXJndW1lbnQgVHJhbnNmb3Jtc1xuICBmdW5jdGlvbiBzb3J0SWZBcmcgKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBjb25zdCB7c29ydCwgb3JkZXJzfSA9IG5vcm1hbGl6ZVNvcnRBcmdzKGFjdGlvbik7XG4gICAgaWYgKHNvcnQgIT09IHVuZGVmaW5lZCB8fCBvcmRlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gc29ydEJ5KHN0YXRlLFxuICAgICAgICBzb3J0VHJhbnNmb3JtKHNvcnQsIG9yZGVycyksXG4gICAgICAgIG9yZGVycyk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBhcmdUcmFuc2Zvcm0gKHJlc3VsdCwgYWN0aW9uKSB7XG4gICAgcmV0dXJuIF8ocmVzdWx0KVxuICAgICAgLnRocnUoXy5wYXJ0aWFsUmlnaHQobWFwSW5kZXhlcywgYWN0aW9uKSlcbiAgICAgIC50aHJ1KF8ucGFydGlhbFJpZ2h0KHNvcnRJZkFyZywgYWN0aW9uKSlcbiAgICAgIC52YWx1ZSgpO1xuICB9XG5cbiAgLy8gUmVkdWNlciBUcmFuc2Zvcm1zXG4gIGZ1bmN0aW9uIGNvbGxlY3Rpb25SZWR1Y2VyV3JhcCAocmVkdWNlciwgc3RhdGUsIGFjdGlvbkFyZ3MsIC4uLmFyZ3MpIHtcbiAgICBjaGVja1N0YXRlKHN0YXRlKTtcbiAgICBjb25zdCBzdGF0ZUFyZyA9IGFyZ1RyYW5zZm9ybShzdGF0ZSwgYWN0aW9uQXJncyk7XG4gICAgY29uc3QgYWN0aW9uID0gbm9ybWFsaXplQWN0aW9uKHN0YXRlQXJnLCBhY3Rpb25BcmdzKTtcbiAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyLmNhbGwodGhpcywgc3RhdGVBcmcsIGFjdGlvbiwgLi4uYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdFRyYW5zZm9ybShyZXN1bHQsIGFjdGlvbik7XG4gIH1cblxuICBmdW5jdGlvbiBzb3J0UmVkdWNlcldyYXAgKHJlZHVjZXIsIHN0YXRlLCBhY3Rpb24sIC4uLmFyZ3MpIHtcbiAgICBjaGVja1N0YXRlKHN0YXRlKTtcbiAgICBjb25zdCBzdGF0ZUFyZyA9IGFyZ1RyYW5zZm9ybShzdGF0ZSwgYWN0aW9uKTtcbiAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyLmNhbGwodGhpcywgc3RhdGVBcmcsIGFjdGlvbiwgLi4uYXJncyk7XG4gICAgcmV0dXJuIHNvcnRSZXN1bHRUcmFuc2Zvcm0ocmVzdWx0LCBhY3Rpb24pO1xuICB9XG5cbiAgZnVuY3Rpb24gaXRlbVJlZHVjZXJXcmFwKGZuLCB7aXRlbSwgaW5kZXh9LCAuLi5hcmdzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gZm4oaXRlbSwgLi4uYXJncyk7XG4gICAgcmV0dXJuIHtpdGVtOiByZXN1bHQsIGluZGV4fTtcbiAgfVxuXG5cblxuICAvLyBNYXRjaGVyIG1ldGhvZHNcbiAgY29uc3QgZ2V0SW5kZXhlcyA9IGdldEluZGV4ZXNCYXNlLmJpbmQodGhpcywgaW5kZXhlc09mKTtcbiAgY29uc3QgZ2V0TW92ZUluZGV4ZXMgPSBnZXRNb3ZlSW5kZXhlc0Jhc2UuYmluZCh0aGlzLCBpbmRleGVzT2YpO1xuXG5cbiAgY29uc3QgY29sbGVjdG9yT2JqZWN0ID0gY29sbGVjdG9yUmVkdWNlckJhc2Uoe1xuICAgIGl0ZW1EZWZhdWx0LFxuICAgIG1hdGNoZXIsXG4gICAgZ2V0SW5kZXhlcyxcbiAgICBnZXRNb3ZlSW5kZXhlcyxcbiAgICBhZGRXcmFwcGVyLFxuICAgIHJlZHVjZXI6IF8ud3JhcChpdGVtUmVkdWNlciwgaXRlbVJlZHVjZXJXcmFwKSxcbiAgICBzb3J0QnlcbiAgfSk7XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGNvbGxlY3Rvck9iamVjdCkucmVkdWNlKChwb2ludGVyLCBrZXkpID0+IHtcblxuICAgIGlmIChjb250YWlucyhzb3J0UmVkdWNlcnMsIGtleSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnBvaW50ZXIsXG4gICAgICAgIFtrZXldOiBfLndyYXAoY29sbGVjdG9yT2JqZWN0W2tleV0sIHNvcnRSZWR1Y2VyV3JhcClcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnBvaW50ZXIsXG4gICAgICBba2V5XTogXy53cmFwKGNvbGxlY3Rvck9iamVjdFtrZXldLCBjb2xsZWN0aW9uUmVkdWNlcldyYXApXG4gICAgfTtcbiAgfSwge30pO1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlQ29sbGVjdG9yO1xuIl19