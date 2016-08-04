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

  var _ref$matcher = _ref.matcher;
  var matcherConfig = _ref$matcher === undefined ? _defaultResolver.defaultMatcher : _ref$matcher;
  var indexOfArg = _ref.indexOf;
  var indexesOfArg = _ref.indexesOf;
  var sortByArg = _ref.sortBy;

  var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref2$reducer = _ref2.reducer;
  var itemReducer = _ref2$reducer === undefined ? _lodash2.default.identity : _ref2$reducer;
  var itemDefault = _ref2.itemDefault;


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb2xsZWN0b3ItcmVkdWNlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUVBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVMsVUFBVCxDQUFxQixLQUFyQixFQUE0QjtBQUMxQixNQUFJLENBQUMsaUJBQUUsT0FBRixDQUFVLEtBQVYsQ0FBTCxFQUF1QjtBQUNyQix5Q0FBbUMsS0FBSyxTQUFMLENBQWUsS0FBZixDQUFuQztBQUNEO0FBQ0Y7O0FBRUQsU0FBUyxpQkFBVCxHQUFtTTtBQUFBLG1FQUEzRCxFQUEyRDs7QUFBQSwwQkFBdkssT0FBdUs7QUFBQSxNQUE5SixhQUE4SjtBQUFBLE1BQXJILFVBQXFILFFBQTlILE9BQThIO0FBQUEsTUFBOUYsWUFBOEYsUUFBekcsU0FBeUc7QUFBQSxNQUF4RSxTQUF3RSxRQUFoRixNQUFnRjs7QUFBQSxvRUFBSixFQUFJOztBQUFBLDRCQUF0RCxPQUFzRDtBQUFBLE1BQTdDLFdBQTZDLGlDQUEvQixpQkFBRSxRQUE2QjtBQUFBLE1BQW5CLFdBQW1CLFNBQW5CLFdBQW1COzs7O0FBR2pNLE1BQU0sVUFBVSxpQkFBRSxJQUFGLENBQU8sYUFBUCxtQkFBaEI7QUFDQSxNQUFNLFlBQVksZ0JBQWdCLHlDQUFrQixPQUFsQixDQUFsQztBQUNBLE1BQU0sVUFBVSxjQUFjLHVDQUFnQixTQUFoQixDQUE5QjtBQUNBLE1BQU0sU0FBUyxhQUFhLGlCQUFFLE9BQTlCO0FBQ0EsTUFBTSxrQkFBa0IsNkJBQW9CLElBQXBCLENBQXlCLElBQXpCLEVBQStCLE9BQS9CLENBQXhCOzs7QUFJQSxXQUFTLFNBQVQsQ0FBb0IsS0FBcEIsRUFBMkIsTUFBM0IsRUFBbUM7QUFBQSw2QkFDVixvQ0FBa0IsTUFBbEIsQ0FEVTs7QUFBQSxRQUMxQixJQUQwQixzQkFDMUIsSUFEMEI7QUFBQSxRQUNwQixNQURvQixzQkFDcEIsTUFEb0I7O0FBRWpD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OlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7Y29udGFpbnMsIG1hdGNoZXJXcmFwLCBtYXBJbmRleGVzLCByZXN1bHRUcmFuc2Zvcm0sIHNvcnRSZXN1bHRUcmFuc2Zvcm0sIGFkZFdyYXBwZXIsIHNvcnRUcmFuc2Zvcm19IGZyb20gJy4vbGliJztcblxuaW1wb3J0IHtkZWZhdWx0TWF0Y2hlcn0gZnJvbSAnLi9kZWZhdWx0LXJlc29sdmVyJztcbmltcG9ydCB7Z2VuZXJhdGVJbmRleGVzT2YsIGdlbmVyYXRlSW5kZXhvZn0gZnJvbSAnLi9tZXRob2QtZ2VuZXJhdG9ycyc7XG5cbmltcG9ydCB7bm9ybWFsaXplU29ydEFyZ3MsIG5vcm1hbGl6ZUFjdGlvbiBhcyBub3JtYWxpemVBY3Rpb25CYXNlfSBmcm9tICcuL25vcm1hbGl6ZXJzJztcbmltcG9ydCB7Z2V0SW5kZXhlc0Jhc2UsIGdldE1vdmVJbmRleGVzQmFzZX0gZnJvbSAnLi9tYXRjaC1tZXRob2RzJztcbmltcG9ydCBjb2xsZWN0b3JSZWR1Y2VyQmFzZSBmcm9tICcuL2NvbGxlY3Rvci1yZWR1Y2VyLWJhc2UnO1xuaW1wb3J0IHtzb3J0UmVkdWNlcnN9IGZyb20gJy4vY29uZmlnJztcblxuZnVuY3Rpb24gY2hlY2tTdGF0ZSAoc3RhdGUpIHtcbiAgaWYgKCFfLmlzQXJyYXkoc3RhdGUpKSB7XG4gICAgdGhyb3cgYFtSZWR1eCBDb2xsZWN0b3JdIC0gU3RhdGUgJHtKU09OLnN0cmluZ2lmeShzdGF0ZSl9IGlzIG5vdCBhbiBhcnJheS4gQWxsIGNvbGxlY3RvciByZWR1Y2VycyBtdXN0IGJlIHBhc3NlZCBhbiBhcnJheS5gO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ29sbGVjdG9yKHttYXRjaGVyOiBtYXRjaGVyQ29uZmlnID0gZGVmYXVsdE1hdGNoZXIsIGluZGV4T2Y6IGluZGV4T2ZBcmcsIGluZGV4ZXNPZjogaW5kZXhlc09mQXJnLCBzb3J0Qnk6IHNvcnRCeUFyZ30gPSB7fSwge3JlZHVjZXI6IGl0ZW1SZWR1Y2VyID0gXy5pZGVudGl0eSwgaXRlbURlZmF1bHR9ID0ge30pIHtcblxuICAvLyBNYXRjaGVyIE1ldGhvZHNcbiAgY29uc3QgbWF0Y2hlciA9IF8ud3JhcChtYXRjaGVyQ29uZmlnLCBtYXRjaGVyV3JhcCk7XG4gIGNvbnN0IGluZGV4ZXNPZiA9IGluZGV4ZXNPZkFyZyB8fCBnZW5lcmF0ZUluZGV4ZXNPZihtYXRjaGVyKTtcbiAgY29uc3QgaW5kZXhPZiA9IGluZGV4T2ZBcmcgfHwgZ2VuZXJhdGVJbmRleG9mKGluZGV4ZXNPZik7XG4gIGNvbnN0IHNvcnRCeSA9IHNvcnRCeUFyZyB8fCBfLm9yZGVyQnk7XG4gIGNvbnN0IG5vcm1hbGl6ZUFjdGlvbiA9IG5vcm1hbGl6ZUFjdGlvbkJhc2UuYmluZCh0aGlzLCBpbmRleE9mKTtcblxuXG4gIC8vIEFyZ3VtZW50IFRyYW5zZm9ybXNcbiAgZnVuY3Rpb24gc29ydElmQXJnIChzdGF0ZSwgYWN0aW9uKSB7XG4gICAgY29uc3Qge3NvcnQsIG9yZGVyc30gPSBub3JtYWxpemVTb3J0QXJncyhhY3Rpb24pO1xuICAgIGlmIChzb3J0ICE9PSB1bmRlZmluZWQgfHwgb3JkZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNvcnRCeShzdGF0ZSxcbiAgICAgICAgc29ydFRyYW5zZm9ybShzb3J0LCBvcmRlcnMpLFxuICAgICAgICBvcmRlcnMpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gYXJnVHJhbnNmb3JtIChyZXN1bHQsIGFjdGlvbikge1xuICAgIHJldHVybiBfKHJlc3VsdClcbiAgICAgIC50aHJ1KF8ucGFydGlhbFJpZ2h0KG1hcEluZGV4ZXMsIGFjdGlvbikpXG4gICAgICAudGhydShfLnBhcnRpYWxSaWdodChzb3J0SWZBcmcsIGFjdGlvbikpXG4gICAgICAudmFsdWUoKTtcbiAgfVxuXG4gIC8vIFJlZHVjZXIgVHJhbnNmb3Jtc1xuICBmdW5jdGlvbiBjb2xsZWN0aW9uUmVkdWNlcldyYXAgKHJlZHVjZXIsIHN0YXRlLCBhY3Rpb25BcmdzLCAuLi5hcmdzKSB7XG4gICAgY2hlY2tTdGF0ZShzdGF0ZSk7XG4gICAgY29uc3Qgc3RhdGVBcmcgPSBhcmdUcmFuc2Zvcm0oc3RhdGUsIGFjdGlvbkFyZ3MpO1xuICAgIGNvbnN0IGFjdGlvbiA9IG5vcm1hbGl6ZUFjdGlvbihzdGF0ZUFyZywgYWN0aW9uQXJncyk7XG4gICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlci5jYWxsKHRoaXMsIHN0YXRlQXJnLCBhY3Rpb24sIC4uLmFyZ3MpO1xuICAgIHJldHVybiByZXN1bHRUcmFuc2Zvcm0ocmVzdWx0LCBhY3Rpb24pO1xuICB9XG5cbiAgZnVuY3Rpb24gc29ydFJlZHVjZXJXcmFwIChyZWR1Y2VyLCBzdGF0ZSwgYWN0aW9uLCAuLi5hcmdzKSB7XG4gICAgY2hlY2tTdGF0ZShzdGF0ZSk7XG4gICAgY29uc3Qgc3RhdGVBcmcgPSBhcmdUcmFuc2Zvcm0oc3RhdGUsIGFjdGlvbik7XG4gICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlci5jYWxsKHRoaXMsIHN0YXRlQXJnLCBhY3Rpb24sIC4uLmFyZ3MpO1xuICAgIHJldHVybiBzb3J0UmVzdWx0VHJhbnNmb3JtKHJlc3VsdCwgYWN0aW9uKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGl0ZW1SZWR1Y2VyV3JhcChmbiwge2l0ZW0sIGluZGV4fSwgLi4uYXJncykge1xuICAgIGNvbnN0IHJlc3VsdCA9IGZuKGl0ZW0sIC4uLmFyZ3MpO1xuICAgIHJldHVybiB7aXRlbTogcmVzdWx0LCBpbmRleH07XG4gIH1cblxuXG5cbiAgLy8gTWF0Y2hlciBtZXRob2RzXG4gIGNvbnN0IGdldEluZGV4ZXMgPSBnZXRJbmRleGVzQmFzZS5iaW5kKHRoaXMsIGluZGV4ZXNPZik7XG4gIGNvbnN0IGdldE1vdmVJbmRleGVzID0gZ2V0TW92ZUluZGV4ZXNCYXNlLmJpbmQodGhpcywgaW5kZXhlc09mKTtcblxuXG4gIGNvbnN0IGNvbGxlY3Rvck9iamVjdCA9IGNvbGxlY3RvclJlZHVjZXJCYXNlKHtcbiAgICBpdGVtRGVmYXVsdCxcbiAgICBtYXRjaGVyLFxuICAgIGdldEluZGV4ZXMsXG4gICAgZ2V0TW92ZUluZGV4ZXMsXG4gICAgYWRkV3JhcHBlcixcbiAgICByZWR1Y2VyOiBfLndyYXAoaXRlbVJlZHVjZXIsIGl0ZW1SZWR1Y2VyV3JhcCksXG4gICAgc29ydEJ5XG4gIH0pO1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhjb2xsZWN0b3JPYmplY3QpLnJlZHVjZSgocG9pbnRlciwga2V5KSA9PiB7XG5cbiAgICBpZiAoY29udGFpbnMoc29ydFJlZHVjZXJzLCBrZXkpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5wb2ludGVyLFxuICAgICAgICBba2V5XTogXy53cmFwKGNvbGxlY3Rvck9iamVjdFtrZXldLCBzb3J0UmVkdWNlcldyYXApXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5wb2ludGVyLFxuICAgICAgW2tleV06IF8ud3JhcChjb2xsZWN0b3JPYmplY3Rba2V5XSwgY29sbGVjdGlvblJlZHVjZXJXcmFwKVxuICAgIH07XG4gIH0sIHt9KTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZUNvbGxlY3RvcjtcbiJdfQ==