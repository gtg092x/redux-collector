'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lib = require('./lib');

var _defaultMatcher = require('./default-matcher');

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


  var matcherConfig = matcherArg === undefined ? _defaultMatcher.defaultMatcher : _lodash2.default.partialRight(matcherArg, _defaultMatcher.defaultMatcher);

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
    var indexes = (0, _normalizers.normalizeIndexArgs)(actionArgs);

    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    var result = reducer.call.apply(reducer, [this, stateArg, _extends({}, action, indexes)].concat(args));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb2xsZWN0b3ItcmVkdWNlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUVBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVMsVUFBVCxDQUFxQixLQUFyQixFQUE0QjtBQUMxQixNQUFJLENBQUMsaUJBQUUsT0FBRixDQUFVLEtBQVYsQ0FBTCxFQUF1QjtBQUNyQix5Q0FBbUMsS0FBSyxTQUFMLENBQWUsS0FBZixDQUFuQztBQUNEO0FBQ0Y7O0FBRUQsU0FBUyxpQkFBVCxHQUErSztBQUFBLG1FQUEzRCxFQUEyRDs7QUFBQSxNQUExSSxVQUEwSSxRQUFuSixPQUFtSjtBQUFBLE1BQXJILFVBQXFILFFBQTlILE9BQThIO0FBQUEsTUFBOUYsWUFBOEYsUUFBekcsU0FBeUc7QUFBQSxNQUF4RSxTQUF3RSxRQUFoRixNQUFnRjs7QUFBQSxvRUFBSixFQUFJOztBQUFBLDRCQUF0RCxPQUFzRDtBQUFBLE1BQTdDLFdBQTZDLGlDQUEvQixpQkFBRSxRQUE2QjtBQUFBLE1BQW5CLFdBQW1CLFNBQW5CLFdBQW1COzs7QUFFN0ssTUFBTSxnQkFBZ0IsZUFBZSxTQUFmLG9DQUE0QyxpQkFBRSxZQUFGLENBQWUsVUFBZixpQ0FBbEU7OztBQUdBLE1BQU0sVUFBVSxpQkFBRSxJQUFGLENBQU8sYUFBUCxtQkFBaEI7QUFDQSxNQUFNLFlBQVksZ0JBQWdCLHlDQUFrQixPQUFsQixDQUFsQztBQUNBLE1BQU0sVUFBVSxjQUFjLHVDQUFnQixTQUFoQixDQUE5QjtBQUNBLE1BQU0sU0FBUyxhQUFhLGlCQUFFLE9BQTlCO0FBQ0EsTUFBTSxrQkFBa0IsNkJBQW9CLElBQXBCLENBQXlCLElBQXpCLEVBQStCLE9BQS9CLENBQXhCOzs7QUFJQSxXQUFTLFNBQVQsQ0FBb0IsS0FBcEIsRUFBMkIsTUFBM0IsRUFBbUM7QUFBQSw2QkFDVixvQ0FBa0IsTUFBbEIsQ0FEVTs7QUFBQSxRQUMx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NkIscUJBQTdCLENBRlQ7QUFJRCxHQWJNLEVBYUosRUFiSSxDQUFQO0FBZUQ7O2tCQUVjLGlCIiwiZmlsZSI6ImNvbGxlY3Rvci1yZWR1Y2Vycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge2NvbnRhaW5zLCBtYXRjaGVyV3JhcCwgbWFwSW5kZXhlcywgcmVzdWx0VHJhbnNmb3JtLCBzb3J0UmVzdWx0VHJhbnNmb3JtLCBhZGRXcmFwcGVyLCBzb3J0VHJhbnNmb3JtfSBmcm9tICcuL2xpYic7XG5cbmltcG9ydCB7ZGVmYXVsdE1hdGNoZXJ9IGZyb20gJy4vZGVmYXVsdC1tYXRjaGVyJztcbmltcG9ydCB7Z2VuZXJhdGVJbmRleGVzT2YsIGdlbmVyYXRlSW5kZXhvZn0gZnJvbSAnLi9tZXRob2QtZ2VuZXJhdG9ycyc7XG5cbmltcG9ydCB7bm9ybWFsaXplU29ydEFyZ3MsIG5vcm1hbGl6ZUluZGV4QXJncywgbm9ybWFsaXplQWN0aW9uIGFzIG5vcm1hbGl6ZUFjdGlvbkJhc2V9IGZyb20gJy4vbm9ybWFsaXplcnMnO1xuaW1wb3J0IHtnZXRJbmRleGVzQmFzZSwgZ2V0TW92ZUluZGV4ZXNCYXNlfSBmcm9tICcuL21hdGNoLW1ldGhvZHMnO1xuaW1wb3J0IGNvbGxlY3RvclJlZHVjZXJCYXNlIGZyb20gJy4vY29sbGVjdG9yLXJlZHVjZXItYmFzZSc7XG5pbXBvcnQge3NvcnRSZWR1Y2Vyc30gZnJvbSAnLi9jb25maWcnO1xuXG5mdW5jdGlvbiBjaGVja1N0YXRlIChzdGF0ZSkge1xuICBpZiAoIV8uaXNBcnJheShzdGF0ZSkpIHtcbiAgICB0aHJvdyBgW1JlZHV4IENvbGxlY3Rvcl0gLSBTdGF0ZSAke0pTT04uc3RyaW5naWZ5KHN0YXRlKX0gaXMgbm90IGFuIGFycmF5LiBBbGwgY29sbGVjdG9yIHJlZHVjZXJzIG11c3QgYmUgcGFzc2VkIGFuIGFycmF5LmA7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVDb2xsZWN0b3Ioe21hdGNoZXI6IG1hdGNoZXJBcmcsIGluZGV4T2Y6IGluZGV4T2ZBcmcsIGluZGV4ZXNPZjogaW5kZXhlc09mQXJnLCBzb3J0Qnk6IHNvcnRCeUFyZ30gPSB7fSwge3JlZHVjZXI6IGl0ZW1SZWR1Y2VyID0gXy5pZGVudGl0eSwgaXRlbURlZmF1bHR9ID0ge30pIHtcblxuICBjb25zdCBtYXRjaGVyQ29uZmlnID0gbWF0Y2hlckFyZyA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdE1hdGNoZXIgOiBfLnBhcnRpYWxSaWdodChtYXRjaGVyQXJnLCBkZWZhdWx0TWF0Y2hlcik7XG5cbiAgLy8gTWF0Y2hlciBNZXRob2RzXG4gIGNvbnN0IG1hdGNoZXIgPSBfLndyYXAobWF0Y2hlckNvbmZpZywgbWF0Y2hlcldyYXApO1xuICBjb25zdCBpbmRleGVzT2YgPSBpbmRleGVzT2ZBcmcgfHwgZ2VuZXJhdGVJbmRleGVzT2YobWF0Y2hlcik7XG4gIGNvbnN0IGluZGV4T2YgPSBpbmRleE9mQXJnIHx8IGdlbmVyYXRlSW5kZXhvZihpbmRleGVzT2YpO1xuICBjb25zdCBzb3J0QnkgPSBzb3J0QnlBcmcgfHwgXy5vcmRlckJ5O1xuICBjb25zdCBub3JtYWxpemVBY3Rpb24gPSBub3JtYWxpemVBY3Rpb25CYXNlLmJpbmQodGhpcywgaW5kZXhPZik7XG5cblxuICAvLyBBcmd1bWVudCBUcmFuc2Zvcm1zXG4gIGZ1bmN0aW9uIHNvcnRJZkFyZyAoc3RhdGUsIGFjdGlvbikge1xuICAgIGNvbnN0IHtzb3J0LCBvcmRlcnN9ID0gbm9ybWFsaXplU29ydEFyZ3MoYWN0aW9uKTtcbiAgICBpZiAoc29ydCAhPT0gdW5kZWZpbmVkIHx8IG9yZGVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBzb3J0Qnkoc3RhdGUsXG4gICAgICAgIHNvcnRUcmFuc2Zvcm0oc29ydCwgb3JkZXJzKSxcbiAgICAgICAgb3JkZXJzKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFyZ1RyYW5zZm9ybSAocmVzdWx0LCBhY3Rpb24pIHtcbiAgICByZXR1cm4gXyhyZXN1bHQpXG4gICAgICAudGhydShfLnBhcnRpYWxSaWdodChtYXBJbmRleGVzLCBhY3Rpb24pKVxuICAgICAgLnRocnUoXy5wYXJ0aWFsUmlnaHQoc29ydElmQXJnLCBhY3Rpb24pKVxuICAgICAgLnZhbHVlKCk7XG4gIH1cblxuICAvLyBSZWR1Y2VyIFRyYW5zZm9ybXNcbiAgZnVuY3Rpb24gY29sbGVjdGlvblJlZHVjZXJXcmFwIChyZWR1Y2VyLCBzdGF0ZSwgYWN0aW9uQXJncywgLi4uYXJncykge1xuICAgIGNoZWNrU3RhdGUoc3RhdGUpO1xuICAgIGNvbnN0IHN0YXRlQXJnID0gYXJnVHJhbnNmb3JtKHN0YXRlLCBhY3Rpb25BcmdzKTtcbiAgICBjb25zdCBhY3Rpb24gPSBub3JtYWxpemVBY3Rpb24oc3RhdGVBcmcsIGFjdGlvbkFyZ3MpO1xuICAgIGNvbnN0IGluZGV4ZXMgPSBub3JtYWxpemVJbmRleEFyZ3MoYWN0aW9uQXJncyk7XG4gICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlci5jYWxsKHRoaXMsIHN0YXRlQXJnLCB7Li4uYWN0aW9uLCAuLi5pbmRleGVzfSwgLi4uYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdFRyYW5zZm9ybShyZXN1bHQsIGFjdGlvbik7XG4gIH1cblxuICBmdW5jdGlvbiBzb3J0UmVkdWNlcldyYXAgKHJlZHVjZXIsIHN0YXRlLCBhY3Rpb24sIC4uLmFyZ3MpIHtcbiAgICBjaGVja1N0YXRlKHN0YXRlKTtcbiAgICBjb25zdCBzdGF0ZUFyZyA9IGFyZ1RyYW5zZm9ybShzdGF0ZSwgYWN0aW9uKTtcbiAgICBjb25zdCByZXN1bHQgPSByZWR1Y2VyLmNhbGwodGhpcywgc3RhdGVBcmcsIGFjdGlvbiwgLi4uYXJncyk7XG4gICAgcmV0dXJuIHNvcnRSZXN1bHRUcmFuc2Zvcm0ocmVzdWx0LCBhY3Rpb24pO1xuICB9XG5cbiAgZnVuY3Rpb24gaXRlbVJlZHVjZXJXcmFwKGZuLCB7aXRlbSwgaW5kZXh9LCAuLi5hcmdzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gZm4oaXRlbSwgLi4uYXJncyk7XG4gICAgcmV0dXJuIHtpdGVtOiByZXN1bHQsIGluZGV4fTtcbiAgfVxuXG5cblxuICAvLyBNYXRjaGVyIG1ldGhvZHNcbiAgY29uc3QgZ2V0SW5kZXhlcyA9IGdldEluZGV4ZXNCYXNlLmJpbmQodGhpcywgaW5kZXhlc09mKTtcbiAgY29uc3QgZ2V0TW92ZUluZGV4ZXMgPSBnZXRNb3ZlSW5kZXhlc0Jhc2UuYmluZCh0aGlzLCBpbmRleGVzT2YpO1xuXG5cbiAgY29uc3QgY29sbGVjdG9yT2JqZWN0ID0gY29sbGVjdG9yUmVkdWNlckJhc2Uoe1xuICAgIGl0ZW1EZWZhdWx0LFxuICAgIG1hdGNoZXIsXG4gICAgZ2V0SW5kZXhlcyxcbiAgICBnZXRNb3ZlSW5kZXhlcyxcbiAgICBhZGRXcmFwcGVyLFxuICAgIHJlZHVjZXI6IF8ud3JhcChpdGVtUmVkdWNlciwgaXRlbVJlZHVjZXJXcmFwKSxcbiAgICBzb3J0QnlcbiAgfSk7XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGNvbGxlY3Rvck9iamVjdCkucmVkdWNlKChwb2ludGVyLCBrZXkpID0+IHtcblxuICAgIGlmIChjb250YWlucyhzb3J0UmVkdWNlcnMsIGtleSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnBvaW50ZXIsXG4gICAgICAgIFtrZXldOiBfLndyYXAoY29sbGVjdG9yT2JqZWN0W2tleV0sIHNvcnRSZWR1Y2VyV3JhcClcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnBvaW50ZXIsXG4gICAgICBba2V5XTogXy53cmFwKGNvbGxlY3Rvck9iamVjdFtrZXldLCBjb2xsZWN0aW9uUmVkdWNlcldyYXApXG4gICAgfTtcbiAgfSwge30pO1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlQ29sbGVjdG9yO1xuIl19