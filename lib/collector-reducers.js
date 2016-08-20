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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb2xsZWN0b3ItcmVkdWNlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUVBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVMsVUFBVCxDQUFxQixLQUFyQixFQUE0QjtBQUMxQixNQUFJLENBQUMsaUJBQUUsT0FBRixDQUFVLEtBQVYsQ0FBTCxFQUF1QjtBQUNyQix5Q0FBbUMsS0FBSyxTQUFMLENBQWUsS0FBZixDQUFuQztBQUNEO0FBQ0Y7O0FBRUQsU0FBUyxpQkFBVCxHQUErSztBQUFBLG1FQUEzRCxFQUEyRDs7QUFBQSxNQUExSSxVQUEwSSxRQUFuSixPQUFtSjtBQUFBLE1BQXJILFVBQXFILFFBQTlILE9BQThIO0FBQUEsTUFBOUYsWUFBOEYsUUFBekcsU0FBeUc7QUFBQSxNQUF4RSxTQUF3RSxRQUFoRixNQUFnRjs7QUFBQSxvRUFBSixFQUFJOztBQUFBLDRCQUF0RCxPQUFzRDtBQUFBLE1BQTdDLFdBQTZDLGlDQUEvQixpQkFBRSxRQUE2QjtBQUFBLE1BQW5CLFdBQW1CLFNBQW5CLFdBQW1COzs7QUFFN0ssTUFBTSxnQkFBZ0IsZUFBZSxTQUFmLG9DQUE0QyxpQkFBRSxZQUFGLENBQWUsVUFBZixpQ0FBbEU7O0FBRUE7QUFDQSxNQUFNLFVBQVUsaUJBQUUsSUFBRixDQUFPLGFBQVAsbUJBQWhCO0FBQ0EsTUFBTSxZQUFZLGdCQUFnQix5Q0FBa0IsT0FBbEIsQ0FBbEM7QUFDQSxNQUFNLFVBQVUsY0FBYyx1Q0FBZ0IsU0FBaEIsQ0FBOUI7QUFDQSxNQUFNLFNBQVMsYUFBYSxpQkFBRSxPQUE5QjtBQUNBLE1BQU0sa0JBQWtCLDZCQUFvQixJQUFwQixDQUF5QixJQUF6QixFQUErQixPQUEvQixDQUF4Qjs7QUFHQTtBQUNBLFdBQVMsU0FBVCxDQUFvQixLQUFwQixFQUEyQixNQUEzQixFQUFtQztBQUFBLDZCQUNWLG9DQUFrQixNQUFsQixDQURVOztB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QixHQUFoQixDQUFQLEVBQTZCLHFCQUE3QixDQUZUO0FBSUQsR0FiTSxFQWFKLEVBYkksQ0FBUDtBQWVEOztrQkFFYyxpQiIsImZpbGUiOiJjb2xsZWN0b3ItcmVkdWNlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtjb250YWlucywgbWF0Y2hlcldyYXAsIG1hcEluZGV4ZXMsIHJlc3VsdFRyYW5zZm9ybSwgc29ydFJlc3VsdFRyYW5zZm9ybSwgYWRkV3JhcHBlciwgc29ydFRyYW5zZm9ybX0gZnJvbSAnLi9saWInO1xuXG5pbXBvcnQge2RlZmF1bHRNYXRjaGVyfSBmcm9tICcuL2RlZmF1bHQtbWF0Y2hlcic7XG5pbXBvcnQge2dlbmVyYXRlSW5kZXhlc09mLCBnZW5lcmF0ZUluZGV4b2Z9IGZyb20gJy4vbWV0aG9kLWdlbmVyYXRvcnMnO1xuXG5pbXBvcnQge25vcm1hbGl6ZVNvcnRBcmdzLCBub3JtYWxpemVJbmRleEFyZ3MsIG5vcm1hbGl6ZUFjdGlvbiBhcyBub3JtYWxpemVBY3Rpb25CYXNlfSBmcm9tICcuL25vcm1hbGl6ZXJzJztcbmltcG9ydCB7Z2V0SW5kZXhlc0Jhc2UsIGdldE1vdmVJbmRleGVzQmFzZX0gZnJvbSAnLi9tYXRjaC1tZXRob2RzJztcbmltcG9ydCBjb2xsZWN0b3JSZWR1Y2VyQmFzZSBmcm9tICcuL2NvbGxlY3Rvci1yZWR1Y2VyLWJhc2UnO1xuaW1wb3J0IHtzb3J0UmVkdWNlcnN9IGZyb20gJy4vY29uZmlnJztcblxuZnVuY3Rpb24gY2hlY2tTdGF0ZSAoc3RhdGUpIHtcbiAgaWYgKCFfLmlzQXJyYXkoc3RhdGUpKSB7XG4gICAgdGhyb3cgYFtSZWR1eCBDb2xsZWN0b3JdIC0gU3RhdGUgJHtKU09OLnN0cmluZ2lmeShzdGF0ZSl9IGlzIG5vdCBhbiBhcnJheS4gQWxsIGNvbGxlY3RvciByZWR1Y2VycyBtdXN0IGJlIHBhc3NlZCBhbiBhcnJheS5gO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQ29sbGVjdG9yKHttYXRjaGVyOiBtYXRjaGVyQXJnLCBpbmRleE9mOiBpbmRleE9mQXJnLCBpbmRleGVzT2Y6IGluZGV4ZXNPZkFyZywgc29ydEJ5OiBzb3J0QnlBcmd9ID0ge30sIHtyZWR1Y2VyOiBpdGVtUmVkdWNlciA9IF8uaWRlbnRpdHksIGl0ZW1EZWZhdWx0fSA9IHt9KSB7XG5cbiAgY29uc3QgbWF0Y2hlckNvbmZpZyA9IG1hdGNoZXJBcmcgPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRNYXRjaGVyIDogXy5wYXJ0aWFsUmlnaHQobWF0Y2hlckFyZywgZGVmYXVsdE1hdGNoZXIpO1xuXG4gIC8vIE1hdGNoZXIgTWV0aG9kc1xuICBjb25zdCBtYXRjaGVyID0gXy53cmFwKG1hdGNoZXJDb25maWcsIG1hdGNoZXJXcmFwKTtcbiAgY29uc3QgaW5kZXhlc09mID0gaW5kZXhlc09mQXJnIHx8IGdlbmVyYXRlSW5kZXhlc09mKG1hdGNoZXIpO1xuICBjb25zdCBpbmRleE9mID0gaW5kZXhPZkFyZyB8fCBnZW5lcmF0ZUluZGV4b2YoaW5kZXhlc09mKTtcbiAgY29uc3Qgc29ydEJ5ID0gc29ydEJ5QXJnIHx8IF8ub3JkZXJCeTtcbiAgY29uc3Qgbm9ybWFsaXplQWN0aW9uID0gbm9ybWFsaXplQWN0aW9uQmFzZS5iaW5kKHRoaXMsIGluZGV4T2YpO1xuXG5cbiAgLy8gQXJndW1lbnQgVHJhbnNmb3Jtc1xuICBmdW5jdGlvbiBzb3J0SWZBcmcgKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBjb25zdCB7c29ydCwgb3JkZXJzfSA9IG5vcm1hbGl6ZVNvcnRBcmdzKGFjdGlvbik7XG4gICAgaWYgKHNvcnQgIT09IHVuZGVmaW5lZCB8fCBvcmRlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gc29ydEJ5KHN0YXRlLFxuICAgICAgICBzb3J0VHJhbnNmb3JtKHNvcnQsIG9yZGVycyksXG4gICAgICAgIG9yZGVycyk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBhcmdUcmFuc2Zvcm0gKHJlc3VsdCwgYWN0aW9uKSB7XG4gICAgcmV0dXJuIF8ocmVzdWx0KVxuICAgICAgLnRocnUoXy5wYXJ0aWFsUmlnaHQobWFwSW5kZXhlcywgYWN0aW9uKSlcbiAgICAgIC50aHJ1KF8ucGFydGlhbFJpZ2h0KHNvcnRJZkFyZywgYWN0aW9uKSlcbiAgICAgIC52YWx1ZSgpO1xuICB9XG5cbiAgLy8gUmVkdWNlciBUcmFuc2Zvcm1zXG4gIGZ1bmN0aW9uIGNvbGxlY3Rpb25SZWR1Y2VyV3JhcCAocmVkdWNlciwgc3RhdGUsIGFjdGlvbkFyZ3MsIC4uLmFyZ3MpIHtcbiAgICBjaGVja1N0YXRlKHN0YXRlKTtcbiAgICBjb25zdCBzdGF0ZUFyZyA9IGFyZ1RyYW5zZm9ybShzdGF0ZSwgYWN0aW9uQXJncyk7XG4gICAgY29uc3QgYWN0aW9uID0gbm9ybWFsaXplQWN0aW9uKHN0YXRlQXJnLCBhY3Rpb25BcmdzKTtcbiAgICBjb25zdCBpbmRleGVzID0gbm9ybWFsaXplSW5kZXhBcmdzKGFjdGlvbkFyZ3MpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHJlZHVjZXIuY2FsbCh0aGlzLCBzdGF0ZUFyZywgey4uLmFjdGlvbiwgLi4uaW5kZXhlc30sIC4uLmFyZ3MpO1xuICAgIHJldHVybiByZXN1bHRUcmFuc2Zvcm0ocmVzdWx0LCBhY3Rpb24pO1xuICB9XG5cbiAgZnVuY3Rpb24gc29ydFJlZHVjZXJXcmFwIChyZWR1Y2VyLCBzdGF0ZSwgYWN0aW9uLCAuLi5hcmdzKSB7XG4gICAgY2hlY2tTdGF0ZShzdGF0ZSk7XG4gICAgY29uc3Qgc3RhdGVBcmcgPSBhcmdUcmFuc2Zvcm0oc3RhdGUsIGFjdGlvbik7XG4gICAgY29uc3QgcmVzdWx0ID0gcmVkdWNlci5jYWxsKHRoaXMsIHN0YXRlQXJnLCBhY3Rpb24sIC4uLmFyZ3MpO1xuICAgIHJldHVybiBzb3J0UmVzdWx0VHJhbnNmb3JtKHJlc3VsdCwgYWN0aW9uKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGl0ZW1SZWR1Y2VyV3JhcChmbiwge2l0ZW0sIGluZGV4fSwgLi4uYXJncykge1xuICAgIGNvbnN0IHJlc3VsdCA9IGZuKGl0ZW0sIC4uLmFyZ3MpO1xuICAgIHJldHVybiB7aXRlbTogcmVzdWx0LCBpbmRleH07XG4gIH1cblxuXG5cbiAgLy8gTWF0Y2hlciBtZXRob2RzXG4gIGNvbnN0IGdldEluZGV4ZXMgPSBnZXRJbmRleGVzQmFzZS5iaW5kKHRoaXMsIGluZGV4ZXNPZik7XG4gIGNvbnN0IGdldE1vdmVJbmRleGVzID0gZ2V0TW92ZUluZGV4ZXNCYXNlLmJpbmQodGhpcywgaW5kZXhlc09mKTtcblxuXG4gIGNvbnN0IGNvbGxlY3Rvck9iamVjdCA9IGNvbGxlY3RvclJlZHVjZXJCYXNlKHtcbiAgICBpdGVtRGVmYXVsdCxcbiAgICBtYXRjaGVyLFxuICAgIGdldEluZGV4ZXMsXG4gICAgZ2V0TW92ZUluZGV4ZXMsXG4gICAgYWRkV3JhcHBlcixcbiAgICByZWR1Y2VyOiBfLndyYXAoaXRlbVJlZHVjZXIsIGl0ZW1SZWR1Y2VyV3JhcCksXG4gICAgc29ydEJ5XG4gIH0pO1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhjb2xsZWN0b3JPYmplY3QpLnJlZHVjZSgocG9pbnRlciwga2V5KSA9PiB7XG5cbiAgICBpZiAoY29udGFpbnMoc29ydFJlZHVjZXJzLCBrZXkpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5wb2ludGVyLFxuICAgICAgICBba2V5XTogXy53cmFwKGNvbGxlY3Rvck9iamVjdFtrZXldLCBzb3J0UmVkdWNlcldyYXApXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAuLi5wb2ludGVyLFxuICAgICAgW2tleV06IF8ud3JhcChjb2xsZWN0b3JPYmplY3Rba2V5XSwgY29sbGVjdGlvblJlZHVjZXJXcmFwKVxuICAgIH07XG4gIH0sIHt9KTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZUNvbGxlY3RvcjtcbiJdfQ==