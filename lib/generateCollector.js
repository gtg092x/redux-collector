'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lib = require('./lib');

var _defaultResolver = require('./default-resolver');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function generateIndexesOf(matcher) {
  return function (state, query, _ref) {
    var _ref$skip = _ref.skip;
    var skip = _ref$skip === undefined ? 0 : _ref$skip;
    var _ref$limit = _ref.limit;
    var limit = _ref$limit === undefined ? state.length : _ref$limit;

    var indexes = [];
    for (var i = skip; i < limit && i < state.length; i++) {
      if (matcher(state[i], query)) {
        indexes.push(i);
      }
    }
    return indexes;
  };
}

function generateIndexof(indexesOf) {
  return function (arr, query) {
    var skip = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    return _lodash2.default.first(indexesOf(arr, query, { skip: skip, limit: 1 }));
  };
}

function generateCollector() {
  var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref2$matcher = _ref2.matcher;
  var matcher = _ref2$matcher === undefined ? _defaultResolver.defaultMatcher : _ref2$matcher;
  var indexOfArg = _ref2.indexOf;
  var indexesOfArg = _ref2.indexesOf;
  var sortByArg = _ref2.sortBy;


  var indexesOf = indexesOfArg || generateIndexesOf(matcher);

  var indexOf = indexOfArg || generateIndexof(indexesOf);

  var sortBy = sortByArg || _lodash2.default.sortBy;

  var sortFn = function sortFn() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var _action$data = action.data;
    var sorter = _action$data === undefined ? action.orderBy : _action$data;

    var newstate = state.map(function (item) {
      var newItem = _lodash2.default.clone(item);
      return newItem;
    });
    return sortBy(newstate, sorter);
  };

  var sortIfArg = function sortIfArg(state, action) {
    var _action$sort = action.sort;
    var sort = _action$sort === undefined ? action.orderBy : _action$sort;

    if (sort !== undefined) {
      var newstate = state.map(function (item) {
        var newItem = _lodash2.default.clone(item);
        return newItem;
      });
      return sortBy(newstate, sort);
    }
    return state;
  };

  var normalizeAction = function normalizeAction(state, action) {
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
      toSkip = indexOf(state, after, skip);
    }
    return _extends({ skip: toSkip, limit: toLimit }, rest);
  };

  var getIndexes = function getIndexes(state, action) {
    var indexes = action.indexes;
    var ranges = action.ranges;
    var queries = action.queries;

    var _normalizeAction = normalizeAction(state, action);

    var _normalizeAction$skip = _normalizeAction.skip;
    var skip = _normalizeAction$skip === undefined ? 0 : _normalizeAction$skip;
    var _normalizeAction$limi = _normalizeAction.limit;
    var limit = _normalizeAction$limi === undefined ? state.length : _normalizeAction$limi;

    var result = [];

    if (indexes !== undefined) {
      result.push.apply(result, _toConsumableArray(indexes));
    }

    if (ranges !== undefined) {
      (function () {
        var rangeResult = [];
        ranges.forEach(function (range) {
          var _range$map3 = range.map(_lib.clamp.bind(undefined, state.length));

          var _range$map4 = _slicedToArray(_range$map3, 2);

          var start = _range$map4[0];
          var end = _range$map4[1];

          for (var i = start; i < end; i++) {
            rangeResult.push(i);
          }
        });
        result.push.apply(result, rangeResult);
      })();
    }

    if (queries !== undefined) {
      (function () {
        var queryResult = [];
        queries.forEach(function (query) {
          queryResult.push(indexesOf(state, query));
        });
        result.push.apply(result, queryResult);
      })();
    }

    return _lodash2.default.sortBy(_lodash2.default.unique(result).slice(skip, limit - skip));
  };

  var getSwapIndexes = function getSwapIndexes(state, action) {
    return getIndexes(state, action);
  };

  var resultTransform = _lodash2.default.identity;

  var argTransform = function argTransform(result, action) {
    return sortIfArg(result, action);
  };

  var getMoveIndexes = function getMoveIndexes(state, action) {
    var from = getIndexes(state, action.from);
    var to = _lodash2.default.first(getIndexes(state, action.to));
    return { from: from, to: to };
  };

  return {
    add: function add() {
      var stateArg = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var state = argTransform(stateArg, action);

      var _normalizeAction2 = normalizeAction(state, action);

      var _normalizeAction2$ski = _normalizeAction2.skip;
      var skip = _normalizeAction2$ski === undefined ? state.length : _normalizeAction2$ski;
      var addArg = _normalizeAction2.add;

      var add = addArg === undefined ? action.data : addArg;
      return resultTransform([].concat(_toConsumableArray(state.slice(0, skip)), [add], _toConsumableArray(state.slice(skip))), action);
    },
    addRange: function addRange() {
      var stateArg = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var state = argTransform(stateArg, action);

      var _normalizeAction3 = normalizeAction(state, action);

      var _normalizeAction3$ski = _normalizeAction3.skip;
      var skip = _normalizeAction3$ski === undefined ? state.length : _normalizeAction3$ski;
      var addArg = _normalizeAction3.add;


      var add = addArg === undefined ? action.data : addArg;

      return resultTransform([].concat(_toConsumableArray(state.slice(0, skip)), _toConsumableArray(add), _toConsumableArray(state.slice(skip))), action);
    },
    move: function move() {
      var stateArg = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var state = argTransform(stateArg, action);

      var _getMoveIndexes = getMoveIndexes(state, action);

      var to = _getMoveIndexes.to;
      var from = _getMoveIndexes.from;


      var arr = [].concat(_toConsumableArray(state));
      var toInject = [];

      for (var i = from.length - 1; i >= 0; i--) {
        var _fromIndex = from[i];
        toInject.push({ item: arr.splice(_fromIndex, 1), index: i });
      }
      // figure this out
      var stateIndex = state.map(function (item, index) {
        return { item: item, index: index };
      });

      var noFromIndexes = function noFromIndexes(_ref3) {
        var item = _ref3.item;
        var index = _ref3.index;
        return !_lodash2.default.contains(fromIndex, index);
      };

      arr = [stateIndex.slice(0, to).filter(noFromIndexes).map(function (_ref4) {
        var item = _ref4.item;
        return item;
      })].concat(_toConsumableArray(toInject.map(function (_ref5) {
        var item = _ref5.item;
        return item;
      })), [stateIndex.slice(to).filter(noFromIndexes).map(function (_ref6) {
        var item = _ref6.item;
        return item;
      })]);

      return resultTransform(arr, action);
    },
    swap: function swap() {
      var stateArg = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var state = argTransform(stateArg, action);
      var indexes = getSwapIndexes(state, action);

      var arr = [].concat(_toConsumableArray(state));

      for (var i = 0; i < indexes.length - 1; i++) {
        var index1 = indexes.slice(i + 1)[0];
        var index2 = indexes[i];
        var temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
      }

      return resultTransform(arr, action);
    },
    update: function update() {
      var stateArg = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var reducer = arguments.length <= 2 || arguments[2] === undefined ? _lodash2.default.identity : arguments[2];

      var state = argTransform(stateArg, action);

      var _normalizeAction4 = normalizeAction(state, action);

      var limit = _normalizeAction4.limit;
      var _normalizeAction4$ski = _normalizeAction4.skip;
      var skip = _normalizeAction4$ski === undefined ? 0 : _normalizeAction4$ski;
      var query = _normalizeAction4.query;
      var _normalizeAction4$act = _normalizeAction4.action;
      var subAction = _normalizeAction4$act === undefined ? action.data : _normalizeAction4$act;

      var rest = _objectWithoutProperties(_normalizeAction4, ['limit', 'skip', 'query', 'action']);

      var result = [];

      for (var i = 0; i < state.length; i++) {
        if (i >= skip && result.length < limit && matcher(state[i], query)) {
          result.push(reducer(state[i], _extends({}, rest, subAction)));
        } else {
          result.push(state[i]);
        }
      }
      return resultTransform(result, action);
    },
    filter: function filter() {
      var stateArg = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var state = argTransform(stateArg, action);

      var _normalizeAction5 = normalizeAction(state, action);

      var limit = _normalizeAction5.limit;
      var _normalizeAction5$ski = _normalizeAction5.skip;
      var skip = _normalizeAction5$ski === undefined ? 0 : _normalizeAction5$ski;
      var query = _normalizeAction5.query;

      var result = [];
      for (var i = 0, removed = 0; i < state.length; i++) {
        if (i < skip || removed >= limit || query !== undefined && !matcher(state[i], query)) {
          result.push(state[i]);
        } else {
          removed++;
        }
      }
      return resultTransform(result, action);
    },

    sort: sortFn
  };
}

exports.default = generateCollector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9nZW5lcmF0ZUNvbGxlY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFFQTs7Ozs7Ozs7QUFFQSxTQUFTLGlCQUFULENBQTJCLE9BQTNCLEVBQW9DO0FBQ2xDLFNBQU8sVUFBQyxLQUFELEVBQVEsS0FBUixRQUFvRDtBQUFBLHlCQUFwQyxJQUFvQztBQUFBLFFBQXBDLElBQW9DLDZCQUE3QixDQUE2QjtBQUFBLDBCQUExQixLQUEwQjtBQUFBLFFBQTFCLEtBQTBCLDhCQUFsQixNQUFNLE1BQVk7O0FBQ3pELFFBQU0sVUFBVSxFQUFoQjtBQUNBLFNBQUssSUFBSSxJQUFJLElBQWIsRUFBbUIsSUFBSSxLQUFKLElBQWEsSUFBSSxNQUFNLE1BQTFDLEVBQWtELEdBQWxELEVBQXdEO0FBQ3RELFVBQUksUUFBUSxNQUFNLENBQU4sQ0FBUixFQUFrQixLQUFsQixDQUFKLEVBQThCO0FBQzVCLGdCQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0Q7QUFDRjtBQUNELFdBQU8sT0FBUDtBQUNELEdBUkQ7QUFTRDs7QUFFRCxTQUFTLGVBQVQsQ0FBeUIsU0FBekIsRUFBb0M7QUFDbEMsU0FBTyxVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQTBCO0FBQUEsUUFBYixJQUFhLHlEQUFOLENBQU07O0FBQy9CLFdBQU8saUJBQUUsS0FBRixDQUFRLFVBQVUsR0FBVixFQUFlLEtBQWYsRUFBc0IsRUFBQyxVQUFELEVBQU8sT0FBTyxDQUFkLEVBQXRCLENBQVIsQ0FBUDtBQUNELEdBRkQ7QUFHRDs7QUFHRCxTQUFTLGlCQUFULEdBQTZIO0FBQUEsb0VBQUosRUFBSTs7QUFBQSw0QkFBakcsT0FBaUc7QUFBQSxNQUFqRyxPQUFpRztBQUFBLE1BQTlELFVBQThELFNBQXZFLE9BQXVFO0FBQUEsTUFBdkMsWUFBdUMsU0FBbEQsU0FBa0Q7QUFBQSxNQUFqQixTQUFpQixTQUF6QixNQUF5Qjs7O0FBRTNILE1BQU0sWUFBWSxnQkFBZ0Isa0JBQWtCLE9BQWxCLENBQWxDOztBQUVBLE1BQU0sVUFBVSxjQUFjLGdCQUFnQixTQUFoQixDQUE5Qjs7QUFFQSxNQUFNLFNBQVMsYUFBYSxpQkFBRSxNQUE5Qjs7QUFFQSxNQUFNLFNBQVMsU0FBVCxNQUFTLEdBQTZCO0FBQUEsUUFBNUIsS0FBNEIseURBQXBCLEVBQW9CO0FBQUEsUUFBaEIsTUFBZ0IseURBQVAsRUFBTztBQUFBLHVCQUNBLE1BREEsQ0FDbkMsSUFEbUM7QUFBQSxRQUM3QixNQUQ2QixnQ0FDbkIsT0FBTyxPQURZOztBQUUxQyxRQUFNLFdBQVcsTUFBTSxHQUFOLENBQVUsZ0JBQVE7QUFDakMsVUFBTSxVQUFVLGlCQUFFLEtBQUYsQ0FBUSxJQUFSLENBQWhCO0FBQ0EsYUFBTyxPQUFQO0FBQ0QsS0FIZ0IsQ0FBakI7QUFJQSxXQUFPLE9BQU8sUUFBUCxFQUFpQixNQUFqQixDQUFQO0FBQ0QsR0FQRDs7QUFTQSxNQUFNLFlBQVksU0FBWixTQUFZLENBQUMsS0FBRCxFQUFRLE1BQVIsRUFBbUI7QUFBQSx1QkFDRCxNQURDLENBQzVCLElBRDRCO0FBQUEsUUFDNUIsSUFENEIsZ0NBQ3BCLE9BQU8sT0FEYTs7QUFFbkMsUUFBSSxTQUFTLFNBQWIsRUFBd0I7QUFDdEIsVUFBTSxXQUFXLE1BQU0sR0FBTixDQUFVLGdCQUFRO0FBQ2pDLFlBQU0sVUFBVSxpQkFBRSxLQUFGLENBQVEsSUFBUixDQUFoQjtBQUNBLGVBQU8sT0FBUDtBQUNELE9BSGdCLENBQWpCO0FBSUEsYUFBTyxPQUFPLFFBQVAsRUFBaUIsSUFBakIsQ0FBUDtBQUNEO0FBQ0QsV0FBTyxLQUFQO0FBQ0QsR0FWRDs7QUFZQSxNQUFNLGtCQUFrQixTQUFsQixlQUFrQixDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQW1CO0FBQUEsUUFDbEMsSUFEa0MsR0FDMEIsTUFEMUIsQ0FDbEMsSUFEa0M7QUFBQSx3QkFDMEIsTUFEMUIsQ0FDNUIsS0FENEI7QUFBQSxRQUM1QixLQUQ0QixpQ0FDcEIsTUFBTSxNQURjO0FBQUEsUUFDTixLQURNLEdBQzBCLE1BRDFCLENBQ04sS0FETTtBQUFBLFFBQ0MsS0FERCxHQUMwQixNQUQxQixDQUNDLEtBREQ7QUFBQSxRQUNRLEtBRFIsR0FDMEIsTUFEMUIsQ0FDUSxLQURSOztBQUFBLFFBQ2tCLElBRGxCLDRCQUMwQixNQUQxQjs7QUFFekMsUUFBSSxTQUFTLElBQWI7QUFDQSxRQUFJLFVBQVUsS0FBZDs7QUFFQSxRQUFJLFVBQVUsU0FBZCxFQUF5QjtBQUN2QixnQkFBVSxDQUFWO0FBQ0EsZUFBUyxnQkFBTSxNQUFNLE1BQVosRUFBb0IsS0FBcEIsQ0FBVDtBQUNELEtBSEQsTUFHTyxJQUFJLFVBQVUsU0FBZCxFQUF5QjtBQUFBLHVCQUNULE1BQU0sR0FBTixDQUFVLFdBQU0sSUFBTixDQUFXLFNBQVgsRUFBc0IsTUFBTSxNQUE1QixDQUFWLENBRFM7O0FBQUE7O0FBQUEsVUFDdkIsS0FEdUI7QUFBQSxVQUNoQixHQURnQjs7QUFFOUIsZ0JBQVUsTUFBTSxLQUFoQjtBQUNBLGVBQVMsS0FBVDtBQUNELEtBSk0sTUFJQSxJQUFJLFVBQVUsU0FBZCxFQUF5QjtBQUM5QixlQUFTLFFBQVEsS0FBUixFQUFlLEtBQWYsRUFBc0IsSUFBdEIsQ0FBVDtBQUNEO0FBQ0Qsc0JBQVEsTUFBTSxNQUFkLEVBQXNCLE9BQU8sT0FBN0IsSUFBeUMsSUFBekM7QUFDRCxHQWhCRDs7QUFrQkEsTUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQW1CO0FBQUEsUUFDN0IsT0FENkIsR0FDRCxNQURDLENBQzdCLE9BRDZCO0FBQUEsUUFDcEIsTUFEb0IsR0FDRCxNQURDLENBQ3BCLE1BRG9CO0FBQUEsUUFDWixPQURZLEdBQ0QsTUFEQyxDQUNaLE9BRFk7O0FBQUEsMkJBRUssZ0JBQWdCLEtBQWhCLEVBQXVCLE1BQXZCLENBRkw7O0FBQUEsaURBRTdCLElBRjZCO0FBQUEsUUFFN0IsSUFGNkIseUNBRXRCLENBRnNCO0FBQUEsaURBRW5CLEtBRm1CO0FBQUEsUUFFbkIsS0FGbUIseUNBRVgsTUFBTSxNQUZLOztBQUdwQyxRQUFNLFNBQVMsRUFBZjs7QUFFQSxRQUFJLFlBQVksU0FBaEIsRUFBMkI7QUFDekIsYUFBTyxJQUFQLGtDQUFlLE9BQWY7QUFDRDs7QUFFRCxRQUFJLFdBQVcsU0FBZixFQUEwQjtBQUFBO0FBQ3hCLFlBQU0sY0FBYyxFQUFwQjtBQUNBLGVBQU8sT0FBUCxDQUFlLGlCQUFTO0FBQUEsNEJBQ0QsTUFBTSxHQUFOLENBQVUsV0FBTSxJQUFOLENBQVcsU0FBWCxFQUFzQixNQUFNLE1BQTVCLENBQVYsQ0FEQzs7QUFBQTs7QUFBQSxjQUNmLEtBRGU7QUFBQSxjQUNSLEdBRFE7O0FBRXRCLGVBQUssSUFBSSxJQUFJLEtBQWIsRUFBb0IsSUFBSSxHQUF4QixFQUE2QixHQUE3QixFQUFtQztBQUNqQyx3QkFBWSxJQUFaLENBQWlCLENBQWpCO0FBQ0Q7QUFDRixTQUxEO0FBTUEsZUFBTyxJQUFQLGVBQWUsV0FBZjtBQVJ3QjtBQVN6Qjs7QUFFRCxRQUFJLFlBQVksU0FBaEIsRUFBMkI7QUFBQTtBQUN6QixZQUFNLGNBQWMsRUFBcEI7QUFDQSxnQkFBUSxPQUFSLENBQWdCLGlCQUFTO0FBQ3ZCLHNCQUFZLElBQVosQ0FBaUIsVUFBVSxLQUFWLEVBQWlCLEtBQWpCLENBQWpCO0FBQ0QsU0FGRDtBQUdBLGVBQU8sSUFBUCxlQUFlLFdBQWY7QUFMeUI7QUFNMUI7O0FBRUQsV0FBTyxpQkFBRSxNQUFGLENBQVMsaUJBQUUsTUFBRixDQUFTLE1BQVQsRUFBaUIsS0FBakIsQ0FBdUIsSUFBdkIsRUFBNkIsUUFBUSxJQUFyQyxDQUFULENBQVA7QUFDRCxHQTdCRDs7QUErQkEsTUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFtQjtBQUN4QyxXQUFPLFdBQVcsS0FBWCxFQUFrQixNQUFsQixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxNQUFNLGtCQUFrQixpQkFBRSxRQUExQjs7QUFFQSxNQUFNLGVBQWUsU0FBZixZQUFlLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBb0I7QUFDdkMsV0FBTyxVQUFVLE1BQVYsRUFBa0IsTUFBbEIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsTUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFtQjtBQUN4QyxRQUFNLE9BQU8sV0FBVyxLQUFYLEVBQWtCLE9BQU8sSUFBekIsQ0FBYjtBQUNBLFFBQU0sS0FBSyxpQkFBRSxLQUFGLENBQVEsV0FBVyxLQUFYLEVBQWtCLE9BQU8sRUFBekIsQ0FBUixDQUFYO0FBQ0EsV0FBTyxFQUFDLFVBQUQsRUFBTyxNQUFQLEVBQVA7QUFDRCxHQUpEOztBQU1BLFNBQU87QUFDTCxPQURLLGlCQUMyQjtBQUFBLFVBQTVCLFFBQTRCLHlEQUFqQixFQUFpQjtBQUFBLFVBQWIsTUFBYSx5REFBSixFQUFJOztBQUM5QixVQUFNLFFBQVEsYUFBYSxRQUFiLEVBQXVCLE1BQXZCLENBQWQ7O0FBRDhCLDhCQUVhLGdCQUFnQixLQUFoQixFQUF1QixNQUF2QixDQUZiOztBQUFBLG9EQUV2QixJQUZ1QjtBQUFBLFVBRXZCLElBRnVCLHlDQUVoQixNQUFNLE1BRlU7QUFBQSxVQUVHLE1BRkgscUJBRUYsR0FGRTs7QUFHOUIsVUFBTSxNQUFNLFdBQVcsU0FBWCxHQUNSLE9BQU8sSUFEQyxHQUVSLE1BRko7QUFHQSxhQUFPLDZDQUFvQixNQUFNLEtBQU4sQ0FBWSxDQUFaLEVBQWUsSUFBZixDQUFwQixJQUEwQyxHQUExQyxzQkFBa0QsTUFBTSxLQUFOLENBQVksSUFBWixDQUFsRCxJQUFzRSxNQUF0RSxDQUFQO0FBQ0QsS0FSSTtBQVNMLFlBVEssc0JBU2dDO0FBQUEsVUFBNUIsUUFBNEIseURBQWpCLEVBQWlCO0FBQUEsVUFBYixNQUFhLHlEQUFKLEVBQUk7O0FBQ25DLFVBQU0sUUFBUSxhQUFhLFFBQWIsRUFBdUIsTUFBdkIsQ0FBZDs7QUFEbUMsOEJBR1EsZ0JBQWdCLEtBQWhCLEVBQXVCLE1BQXZCLENBSFI7O0FBQUEsb0RBRzVCLElBSDRCO0FBQUEsVUFHNUIsSUFINEIseUNBR3JCLE1BQU0sTUFIZTtBQUFBLFVBR0YsTUFIRSxxQkFHUCxHQUhPOzs7QUFLbkMsVUFBTSxNQUFNLFdBQVcsU0FBWCxHQUNSLE9BQU8sSUFEQyxHQUVSLE1BRko7O0FBSUEsYUFBTyw2Q0FBb0IsTUFBTSxLQUFOLENBQVksQ0FBWixFQUFlLElBQWYsQ0FBcEIsc0JBQTZDLEdBQTdDLHNCQUFxRCxNQUFNLEtBQU4sQ0FBWSxJQUFaLENBQXJELElBQXlFLE1BQXpFLENBQVA7QUFDRCxLQW5CSTtBQW9CTCxRQXBCSyxrQkFvQjRCO0FBQUEsVUFBNUIsUUFBNEIseURBQWpCLEVBQWlCO0FBQUEsVUFBYixNQUFhLHlEQUFKLEVBQUk7O0FBQy9CLFVBQU0sUUFBUSxhQUFhLFFBQWIsRUFBdUIsTUFBdkIsQ0FBZDs7QUFEK0IsNEJBRVosZUFBZSxLQUFmLEVBQXNCLE1BQXRCLENBRlk7O0FBQUEsVUFFeEIsRUFGd0IsbUJBRXhCLEVBRndCO0FBQUEsVUFFcEIsSUFGb0IsbUJBRXBCLElBRm9COzs7QUFJL0IsVUFBSSxtQ0FBVSxLQUFWLEVBQUo7QUFDQSxVQUFNLFdBQVcsRUFBakI7O0FBRUEsV0FBSSxJQUFJLElBQUksS0FBSyxNQUFMLEdBQWMsQ0FBMUIsRUFBNkIsS0FBSyxDQUFsQyxFQUFxQyxHQUFyQyxFQUEwQztBQUN4QyxZQUFNLGFBQVksS0FBSyxDQUFMLENBQWxCO0FBQ0EsaUJBQVMsSUFBVCxDQUFjLEVBQUMsTUFBTSxJQUFJLE1BQUosQ0FBVyxVQUFYLEVBQXNCLENBQXRCLENBQVAsRUFBaUMsT0FBTyxDQUF4QyxFQUFkO0FBQ0Q7O0FBRUQsVUFBSSxhQUFhLE1BQU0sR0FBTixDQUFVLFVBQUMsSUFBRCxFQUFPLEtBQVA7QUFBQSxlQUFrQixFQUFDLFVBQUQsRUFBTyxZQUFQLEVBQWxCO0FBQUEsT0FBVixDQUFqQjs7QUFFQSxVQUFNLGdCQUFnQixTQUFoQixhQUFnQjtBQUFBLFlBQUUsSUFBRixTQUFFLElBQUY7QUFBQSxZQUFRLEtBQVIsU0FBUSxLQUFSO0FBQUEsZUFBbUIsQ0FBQyxpQkFBRSxRQUFGLENBQVcsU0FBWCxFQUFzQixLQUF0QixDQUFwQjtBQUFBLE9BQXRCOztBQUVBLGFBQ0UsV0FBVyxLQUFYLENBQWlCLENBQWpCLEVBQW9CLEVBQXBCLEVBQXdCLE1BQXhCLENBQStCLGFBQS9CLEVBQThDLEdBQTlDLENBQWtEO0FBQUEsWUFBRSxJQUFGLFNBQUUsSUFBRjtBQUFBLGVBQVksSUFBWjtBQUFBLE9BQWxELENBREYsNEJBRUssU0FBUyxHQUFULENBQWE7QUFBQSxZQUFFLElBQUYsU0FBRSxJQUFGO0FBQUEsZUFBWSxJQUFaO0FBQUEsT0FBYixDQUZMLElBR0UsV0FBVyxLQUFYLENBQWlCLEVBQWpCLEVBQXFCLE1BQXJCLENBQTRCLGFBQTVCLEVBQTJDLEdBQTNDLENBQStDO0FBQUEsWUFBRSxJQUFGLFNBQUUsSUFBRjtBQUFBLGVBQVksSUFBWjtBQUFBLE9BQS9DLENBSEY7O0FBTUEsYUFBTyxnQkFBZ0IsR0FBaEIsRUFBcUIsTUFBckIsQ0FBUDtBQUNELEtBM0NJO0FBNENMLFFBNUNLLGtCQTRDNEI7QUFBQSxVQUE1QixRQUE0Qix5REFBakIsRUFBaUI7QUFBQSxVQUFiLE1BQWEseURBQUosRUFBSTs7QUFDL0IsVUFBTSxRQUFRLGFBQWEsUUFBYixFQUF1QixNQUF2QixDQUFkO0FBQ0EsVUFBTSxVQUFVLGVBQWUsS0FBZixFQUFzQixNQUF0QixDQUFoQjs7QUFFQSxVQUFJLG1DQUFVLEtBQVYsRUFBSjs7QUFFQSxXQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBSSxRQUFRLE1BQVIsR0FBaUIsQ0FBcEMsRUFBdUMsR0FBdkMsRUFBNEM7QUFDMUMsWUFBTSxTQUFTLFFBQVEsS0FBUixDQUFjLElBQUksQ0FBbEIsRUFBcUIsQ0FBckIsQ0FBZjtBQUNBLFlBQU0sU0FBUyxRQUFRLENBQVIsQ0FBZjtBQUNBLFlBQU0sT0FBTyxJQUFJLE1BQUosQ0FBYjtBQUNBLFlBQUksTUFBSixJQUFjLElBQUksTUFBSixDQUFkO0FBQ0EsWUFBSSxNQUFKLElBQWMsSUFBZDtBQUNEOztBQUVELGFBQU8sZ0JBQWdCLEdBQWhCLEVBQXFCLE1BQXJCLENBQVA7QUFDRCxLQTNESTtBQTRETCxVQTVESyxvQkE0RG9EO0FBQUEsVUFBbEQsUUFBa0QseURBQXZDLEVBQXVDO0FBQUEsVUFBbkMsTUFBbUMseURBQTFCLEVBQTBCO0FBQUEsVUFBdEIsT0FBc0IseURBQVosaUJBQUUsUUFBVTs7QUFDdkQsVUFBTSxRQUFRLGFBQWEsUUFBYixFQUF1QixNQUF2QixDQUFkOztBQUR1RCw4QkFFb0IsZ0JBQWdCLEtBQWhCLEVBQXVCLE1BQXZCLENBRnBCOztBQUFBLFVBRWhELEtBRmdELHFCQUVoRCxLQUZnRDtBQUFBLG9EQUV6QyxJQUZ5QztBQUFBLFVBRXpDLElBRnlDLHlDQUVsQyxDQUZrQztBQUFBLFVBRS9CLEtBRitCLHFCQUUvQixLQUYrQjtBQUFBLG9EQUV4QixNQUZ3QjtBQUFBLFVBRWhCLFNBRmdCLHlDQUVKLE9BQU8sSUFGSDs7QUFBQSxVQUVZLElBRlo7O0FBR3ZELFVBQU0sU0FBUyxFQUFmOztBQUVBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQ3JDLFlBQUksS0FBSyxJQUFMLElBQWEsT0FBTyxNQUFQLEdBQWdCLEtBQTdCLElBQXNDLFFBQVEsTUFBTSxDQUFOLENBQVIsRUFBa0IsS0FBbEIsQ0FBMUMsRUFBb0U7QUFDbEUsaUJBQU8sSUFBUCxDQUFZLFFBQVEsTUFBTSxDQUFOLENBQVIsZUFBc0IsSUFBdEIsRUFBK0IsU0FBL0IsRUFBWjtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFPLElBQVAsQ0FBWSxNQUFNLENBQU4sQ0FBWjtBQUNEO0FBQ0Y7QUFDRCxhQUFPLGdCQUFnQixNQUFoQixFQUF3QixNQUF4QixDQUFQO0FBQ0QsS0F6RUk7QUEwRUwsVUExRUssb0JBMEU4QjtBQUFBLFVBQTVCLFFBQTRCLHlEQUFqQixFQUFpQjtBQUFBLFVBQWIsTUFBYSx5REFBSixFQUFJOztBQUNqQyxVQUFNLFFBQVEsYUFBYSxRQUFiLEVBQXVCLE1BQXZCLENBQWQ7O0FBRGlDLDhCQUVBLGdCQUFnQixLQUFoQixFQUF1QixNQUF2QixDQUZBOztBQUFBLFVBRTFCLEtBRjBCLHFCQUUxQixLQUYwQjtBQUFBLG9EQUVuQixJQUZtQjtBQUFBLFVBRW5CLElBRm1CLHlDQUVaLENBRlk7QUFBQSxVQUVULEtBRlMscUJBRVQsS0FGUzs7QUFHakMsVUFBTSxTQUFTLEVBQWY7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsVUFBVSxDQUExQixFQUE2QixJQUFJLE1BQU0sTUFBdkMsRUFBK0MsR0FBL0MsRUFBb0Q7QUFDbEQsWUFBSSxJQUFJLElBQUosSUFBWSxXQUFXLEtBQXZCLElBQWlDLFVBQVUsU0FBVixJQUF1QixDQUFDLFFBQVEsTUFBTSxDQUFOLENBQVIsRUFBa0IsS0FBbEIsQ0FBN0QsRUFBd0Y7QUFDdEYsaUJBQU8sSUFBUCxDQUFZLE1BQU0sQ0FBTixDQUFaO0FBQ0QsU0FGRCxNQUVPO0FBQ0w7QUFDRDtBQUNGO0FBQ0QsYUFBTyxnQkFBZ0IsTUFBaEIsRUFBd0IsTUFBeEIsQ0FBUDtBQUNELEtBdEZJOztBQXVGTCxVQUFNO0FBdkZELEdBQVA7QUEwRkQ7O2tCQUVjLGlCIiwiZmlsZSI6ImdlbmVyYXRlQ29sbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7Y2xhbXB9IGZyb20gJy4vbGliJztcblxuaW1wb3J0IHtkZWZhdWx0TWF0Y2hlcn0gZnJvbSAnLi9kZWZhdWx0LXJlc29sdmVyJztcblxuZnVuY3Rpb24gZ2VuZXJhdGVJbmRleGVzT2YobWF0Y2hlcikge1xuICByZXR1cm4gKHN0YXRlLCBxdWVyeSwge3NraXAgPSAwLCBsaW1pdCA9IHN0YXRlLmxlbmd0aH0pID0+IHtcbiAgICBjb25zdCBpbmRleGVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IHNraXA7IGkgPCBsaW1pdCAmJiBpIDwgc3RhdGUubGVuZ3RoOyBpICsrKSB7XG4gICAgICBpZiAobWF0Y2hlcihzdGF0ZVtpXSwgcXVlcnkpKSB7XG4gICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluZGV4ZXM7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlSW5kZXhvZihpbmRleGVzT2YpIHtcbiAgcmV0dXJuIChhcnIsIHF1ZXJ5LCBza2lwID0gMCkgPT4ge1xuICAgIHJldHVybiBfLmZpcnN0KGluZGV4ZXNPZihhcnIsIHF1ZXJ5LCB7c2tpcCwgbGltaXQ6IDF9KSk7XG4gIH07XG59XG5cblxuZnVuY3Rpb24gZ2VuZXJhdGVDb2xsZWN0b3Ioe21hdGNoZXIgPSBkZWZhdWx0TWF0Y2hlciwgaW5kZXhPZjogaW5kZXhPZkFyZywgaW5kZXhlc09mOiBpbmRleGVzT2ZBcmcsIHNvcnRCeTogc29ydEJ5QXJnfSA9IHt9KSB7XG5cbiAgY29uc3QgaW5kZXhlc09mID0gaW5kZXhlc09mQXJnIHx8IGdlbmVyYXRlSW5kZXhlc09mKG1hdGNoZXIpO1xuXG4gIGNvbnN0IGluZGV4T2YgPSBpbmRleE9mQXJnIHx8IGdlbmVyYXRlSW5kZXhvZihpbmRleGVzT2YpO1xuXG4gIGNvbnN0IHNvcnRCeSA9IHNvcnRCeUFyZyB8fCBfLnNvcnRCeTtcblxuICBjb25zdCBzb3J0Rm4gPSAoc3RhdGUgPSBbXSwgYWN0aW9uID0ge30pID0+IHtcbiAgICBjb25zdCB7ZGF0YTogc29ydGVyID0gKGFjdGlvbi5vcmRlckJ5KX0gPSBhY3Rpb247XG4gICAgY29uc3QgbmV3c3RhdGUgPSBzdGF0ZS5tYXAoaXRlbSA9PiB7XG4gICAgICBjb25zdCBuZXdJdGVtID0gXy5jbG9uZShpdGVtKTtcbiAgICAgIHJldHVybiBuZXdJdGVtO1xuICAgIH0pO1xuICAgIHJldHVybiBzb3J0QnkobmV3c3RhdGUsIHNvcnRlcik7XG4gIH07XG5cbiAgY29uc3Qgc29ydElmQXJnID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICBjb25zdCB7c29ydCA9IChhY3Rpb24ub3JkZXJCeSl9ID0gYWN0aW9uO1xuICAgIGlmIChzb3J0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IG5ld3N0YXRlID0gc3RhdGUubWFwKGl0ZW0gPT4ge1xuICAgICAgICBjb25zdCBuZXdJdGVtID0gXy5jbG9uZShpdGVtKTtcbiAgICAgICAgcmV0dXJuIG5ld0l0ZW07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBzb3J0QnkobmV3c3RhdGUsIHNvcnQpO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdGU7XG4gIH07XG5cbiAgY29uc3Qgbm9ybWFsaXplQWN0aW9uID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICBjb25zdCB7c2tpcCwgbGltaXQgPSBzdGF0ZS5sZW5ndGgsIGluZGV4LCBhZnRlciwgcmFuZ2UsIC4uLnJlc3R9ID0gYWN0aW9uO1xuICAgIGxldCB0b1NraXAgPSBza2lwO1xuICAgIGxldCB0b0xpbWl0ID0gbGltaXQ7XG5cbiAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgdG9MaW1pdCA9IDE7XG4gICAgICB0b1NraXAgPSBjbGFtcChzdGF0ZS5sZW5ndGgsIGluZGV4KTtcbiAgICB9IGVsc2UgaWYgKHJhbmdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IFtzdGFydCwgZW5kXSA9IHJhbmdlLm1hcChjbGFtcC5iaW5kKHVuZGVmaW5lZCwgc3RhdGUubGVuZ3RoKSk7XG4gICAgICB0b0xpbWl0ID0gZW5kIC0gc3RhcnQ7XG4gICAgICB0b1NraXAgPSBzdGFydDtcbiAgICB9IGVsc2UgaWYgKGFmdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRvU2tpcCA9IGluZGV4T2Yoc3RhdGUsIGFmdGVyLCBza2lwKTtcbiAgICB9XG4gICAgcmV0dXJuIHtza2lwOiB0b1NraXAsIGxpbWl0OiB0b0xpbWl0LCAuLi5yZXN0fTtcbiAgfTtcblxuICBjb25zdCBnZXRJbmRleGVzID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICBjb25zdCB7aW5kZXhlcywgcmFuZ2VzLCBxdWVyaWVzfSA9IGFjdGlvbjtcbiAgICBjb25zdCB7c2tpcCA9IDAsIGxpbWl0ID0gc3RhdGUubGVuZ3RofSA9IG5vcm1hbGl6ZUFjdGlvbihzdGF0ZSwgYWN0aW9uKTtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgIGlmIChpbmRleGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3VsdC5wdXNoKC4uLmluZGV4ZXMpO1xuICAgIH1cblxuICAgIGlmIChyYW5nZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgcmFuZ2VSZXN1bHQgPSBbXTtcbiAgICAgIHJhbmdlcy5mb3JFYWNoKHJhbmdlID0+IHtcbiAgICAgICAgY29uc3QgW3N0YXJ0LCBlbmRdID0gcmFuZ2UubWFwKGNsYW1wLmJpbmQodW5kZWZpbmVkLCBzdGF0ZS5sZW5ndGgpKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICsrKSB7XG4gICAgICAgICAgcmFuZ2VSZXN1bHQucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXN1bHQucHVzaCguLi5yYW5nZVJlc3VsdCk7XG4gICAgfVxuXG4gICAgaWYgKHF1ZXJpZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgcXVlcnlSZXN1bHQgPSBbXTtcbiAgICAgIHF1ZXJpZXMuZm9yRWFjaChxdWVyeSA9PiB7XG4gICAgICAgIHF1ZXJ5UmVzdWx0LnB1c2goaW5kZXhlc09mKHN0YXRlLCBxdWVyeSkpO1xuICAgICAgfSk7XG4gICAgICByZXN1bHQucHVzaCguLi5xdWVyeVJlc3VsdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF8uc29ydEJ5KF8udW5pcXVlKHJlc3VsdCkuc2xpY2Uoc2tpcCwgbGltaXQgLSBza2lwKSk7XG4gIH07XG5cbiAgY29uc3QgZ2V0U3dhcEluZGV4ZXMgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgIHJldHVybiBnZXRJbmRleGVzKHN0YXRlLCBhY3Rpb24pO1xuICB9O1xuXG4gIGNvbnN0IHJlc3VsdFRyYW5zZm9ybSA9IF8uaWRlbnRpdHk7XG5cbiAgY29uc3QgYXJnVHJhbnNmb3JtID0gKHJlc3VsdCwgYWN0aW9uKSA9PiB7XG4gICAgcmV0dXJuIHNvcnRJZkFyZyhyZXN1bHQsIGFjdGlvbik7XG4gIH07XG5cbiAgY29uc3QgZ2V0TW92ZUluZGV4ZXMgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgIGNvbnN0IGZyb20gPSBnZXRJbmRleGVzKHN0YXRlLCBhY3Rpb24uZnJvbSk7XG4gICAgY29uc3QgdG8gPSBfLmZpcnN0KGdldEluZGV4ZXMoc3RhdGUsIGFjdGlvbi50bykpO1xuICAgIHJldHVybiB7ZnJvbSwgdG99O1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgYWRkKHN0YXRlQXJnID0gW10sIGFjdGlvbiA9IHt9KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IGFyZ1RyYW5zZm9ybShzdGF0ZUFyZywgYWN0aW9uKTtcbiAgICAgIGNvbnN0IHtza2lwID0gc3RhdGUubGVuZ3RoLCBhZGQ6IGFkZEFyZ30gPSBub3JtYWxpemVBY3Rpb24oc3RhdGUsIGFjdGlvbik7XG4gICAgICBjb25zdCBhZGQgPSBhZGRBcmcgPT09IHVuZGVmaW5lZFxuICAgICAgICA/IGFjdGlvbi5kYXRhXG4gICAgICAgIDogYWRkQXJnO1xuICAgICAgcmV0dXJuIHJlc3VsdFRyYW5zZm9ybShbLi4uc3RhdGUuc2xpY2UoMCwgc2tpcCksIGFkZCwgLi4uc3RhdGUuc2xpY2Uoc2tpcCldLCBhY3Rpb24pO1xuICAgIH0sXG4gICAgYWRkUmFuZ2Uoc3RhdGVBcmcgPSBbXSwgYWN0aW9uID0ge30pIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gYXJnVHJhbnNmb3JtKHN0YXRlQXJnLCBhY3Rpb24pO1xuXG4gICAgICBjb25zdCB7c2tpcCA9IHN0YXRlLmxlbmd0aCwgYWRkOiBhZGRBcmd9ID0gbm9ybWFsaXplQWN0aW9uKHN0YXRlLCBhY3Rpb24pO1xuXG4gICAgICBjb25zdCBhZGQgPSBhZGRBcmcgPT09IHVuZGVmaW5lZFxuICAgICAgICA/IGFjdGlvbi5kYXRhXG4gICAgICAgIDogYWRkQXJnO1xuXG4gICAgICByZXR1cm4gcmVzdWx0VHJhbnNmb3JtKFsuLi5zdGF0ZS5zbGljZSgwLCBza2lwKSwgLi4uYWRkLCAuLi5zdGF0ZS5zbGljZShza2lwKV0sIGFjdGlvbik7XG4gICAgfSxcbiAgICBtb3ZlKHN0YXRlQXJnID0gW10sIGFjdGlvbiA9IHt9KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IGFyZ1RyYW5zZm9ybShzdGF0ZUFyZywgYWN0aW9uKTtcbiAgICAgIGNvbnN0IHt0bywgZnJvbX0gPSBnZXRNb3ZlSW5kZXhlcyhzdGF0ZSwgYWN0aW9uKTtcblxuICAgICAgbGV0IGFyciA9IFsuLi5zdGF0ZV07XG4gICAgICBjb25zdCB0b0luamVjdCA9IFtdO1xuXG4gICAgICBmb3IobGV0IGkgPSBmcm9tLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IGZyb21JbmRleCA9IGZyb21baV07XG4gICAgICAgIHRvSW5qZWN0LnB1c2goe2l0ZW06IGFyci5zcGxpY2UoZnJvbUluZGV4LCAxKSwgaW5kZXg6IGl9KTtcbiAgICAgIH1cbiAgICAgIC8vIGZpZ3VyZSB0aGlzIG91dFxuICAgICAgbGV0IHN0YXRlSW5kZXggPSBzdGF0ZS5tYXAoKGl0ZW0sIGluZGV4KSA9PiAoe2l0ZW0sIGluZGV4fSkpO1xuXG4gICAgICBjb25zdCBub0Zyb21JbmRleGVzID0gKHtpdGVtLCBpbmRleH0pID0+ICFfLmNvbnRhaW5zKGZyb21JbmRleCwgaW5kZXgpO1xuXG4gICAgICBhcnIgPSBbXG4gICAgICAgIHN0YXRlSW5kZXguc2xpY2UoMCwgdG8pLmZpbHRlcihub0Zyb21JbmRleGVzKS5tYXAoKHtpdGVtfSkgPT4gaXRlbSksXG4gICAgICAgIC4uLnRvSW5qZWN0Lm1hcCgoe2l0ZW19KSA9PiBpdGVtKSxcbiAgICAgICAgc3RhdGVJbmRleC5zbGljZSh0bykuZmlsdGVyKG5vRnJvbUluZGV4ZXMpLm1hcCgoe2l0ZW19KSA9PiBpdGVtKVxuICAgICAgXTtcblxuICAgICAgcmV0dXJuIHJlc3VsdFRyYW5zZm9ybShhcnIsIGFjdGlvbik7XG4gICAgfSxcbiAgICBzd2FwKHN0YXRlQXJnID0gW10sIGFjdGlvbiA9IHt9KSB7XG4gICAgICBjb25zdCBzdGF0ZSA9IGFyZ1RyYW5zZm9ybShzdGF0ZUFyZywgYWN0aW9uKTtcbiAgICAgIGNvbnN0IGluZGV4ZXMgPSBnZXRTd2FwSW5kZXhlcyhzdGF0ZSwgYWN0aW9uKTtcblxuICAgICAgbGV0IGFyciA9IFsuLi5zdGF0ZV07XG5cbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBpbmRleGVzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICBjb25zdCBpbmRleDEgPSBpbmRleGVzLnNsaWNlKGkgKyAxKVswXTtcbiAgICAgICAgY29uc3QgaW5kZXgyID0gaW5kZXhlc1tpXTtcbiAgICAgICAgY29uc3QgdGVtcCA9IGFycltpbmRleDFdO1xuICAgICAgICBhcnJbaW5kZXgxXSA9IGFycltpbmRleDJdO1xuICAgICAgICBhcnJbaW5kZXgyXSA9IHRlbXA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRUcmFuc2Zvcm0oYXJyLCBhY3Rpb24pO1xuICAgIH0sXG4gICAgdXBkYXRlKHN0YXRlQXJnID0gW10sIGFjdGlvbiA9IHt9LCByZWR1Y2VyID0gXy5pZGVudGl0eSkge1xuICAgICAgY29uc3Qgc3RhdGUgPSBhcmdUcmFuc2Zvcm0oc3RhdGVBcmcsIGFjdGlvbik7XG4gICAgICBjb25zdCB7bGltaXQsIHNraXAgPSAwLCBxdWVyeSwgYWN0aW9uOiBzdWJBY3Rpb24gPSBhY3Rpb24uZGF0YSwgLi4ucmVzdH0gPSBub3JtYWxpemVBY3Rpb24oc3RhdGUsIGFjdGlvbik7XG4gICAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaSA+PSBza2lwICYmIHJlc3VsdC5sZW5ndGggPCBsaW1pdCAmJiBtYXRjaGVyKHN0YXRlW2ldLCBxdWVyeSkpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChyZWR1Y2VyKHN0YXRlW2ldLCB7Li4ucmVzdCwgLi4uc3ViQWN0aW9ufSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHN0YXRlW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdFRyYW5zZm9ybShyZXN1bHQsIGFjdGlvbik7XG4gICAgfSxcbiAgICBmaWx0ZXIoc3RhdGVBcmcgPSBbXSwgYWN0aW9uID0ge30pIHtcbiAgICAgIGNvbnN0IHN0YXRlID0gYXJnVHJhbnNmb3JtKHN0YXRlQXJnLCBhY3Rpb24pO1xuICAgICAgY29uc3Qge2xpbWl0LCBza2lwID0gMCwgcXVlcnl9ID0gbm9ybWFsaXplQWN0aW9uKHN0YXRlLCBhY3Rpb24pO1xuICAgICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMCwgcmVtb3ZlZCA9IDA7IGkgPCBzdGF0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaSA8IHNraXAgfHwgcmVtb3ZlZCA+PSBsaW1pdCB8fCAocXVlcnkgIT09IHVuZGVmaW5lZCAmJiAhbWF0Y2hlcihzdGF0ZVtpXSwgcXVlcnkpKSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHN0YXRlW2ldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZW1vdmVkICsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0VHJhbnNmb3JtKHJlc3VsdCwgYWN0aW9uKTtcbiAgICB9LFxuICAgIHNvcnQ6IHNvcnRGblxuICB9O1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlQ29sbGVjdG9yO1xuIl19