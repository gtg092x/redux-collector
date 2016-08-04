'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lib = require('./lib');

var _normalizers = require('./normalizers');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function incrementIndex(_ref) {
  var index = _ref.index;
  var item = _ref.item;

  return {
    item: item,
    index: index + 1
  };
}

function collectorReducerBase(_ref2) {
  var itemDefault = _ref2.itemDefault;
  var matcher = _ref2.matcher;
  var addWrapper = _ref2.addWrapper;
  var getMoveIndexes = _ref2.getMoveIndexes;
  var reducer = _ref2.reducer;
  var getIndexes = _ref2.getIndexes;
  var sortBy = _ref2.sortBy;

  return {
    add: function add() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var _ref3 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _ref3$skip = _ref3.skip;
      var skip = _ref3$skip === undefined ? state.length : _ref3$skip;
      var addArg = _ref3.add;
      var data = _ref3.data;


      var add = addArg === undefined ? data : addArg;

      return [].concat(_toConsumableArray(state.slice(0, skip)), [addWrapper(add === undefined ? itemDefault : add, skip + 1)], _toConsumableArray(state.slice(skip).map(incrementIndex)));
    },
    addRange: function addRange() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var _ref4 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _ref4$skip = _ref4.skip;
      var skip = _ref4$skip === undefined ? state.length : _ref4$skip;
      var addArg = _ref4.add;
      var data = _ref4.data;


      var add = addArg === undefined ? data : addArg;

      if (!_lodash2.default.isArray(add)) {
        add = [add];
      }
      return [].concat(_toConsumableArray(state.slice(0, skip)), _toConsumableArray(add.map(function (item) {
        return item === undefined ? itemDefault : item;
      }).map(function (item, i) {
        return addWrapper(item, skip + i);
      })), _toConsumableArray(state.slice(skip).map(incrementIndex)));
    },
    move: function move() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _getMoveIndexes = getMoveIndexes(state, action);

      var to = _getMoveIndexes.to;
      var from = _getMoveIndexes.from;


      var arr = [].concat(_toConsumableArray(state));
      var toInject = [];

      for (var i = from.length - 1; i >= 0; i--) {
        var fromIndex = from[i];
        toInject.push({ item: arr.splice(fromIndex, 1).pop(), index: fromIndex });
      }
      toInject.reverse();

      var stateIndex = state.map(function (item, index) {
        return { item: item, index: index };
      });

      var noFromIndexes = function noFromIndexes(_ref5) {
        var item = _ref5.item;
        var index = _ref5.index;
        return !(0, _lib.contains)(toInject.map(function (_ref6) {
          var index = _ref6.index;
          return index;
        }), index);
      };

      arr = [].concat(_toConsumableArray(stateIndex.slice(0, to).filter(noFromIndexes).map(function (_ref7) {
        var item = _ref7.item;
        return item;
      })), _toConsumableArray(toInject.map(function (_ref8) {
        var item = _ref8.item;
        return item;
      })), _toConsumableArray(stateIndex.slice(to).filter(noFromIndexes).map(function (_ref9) {
        var item = _ref9.item;
        return item;
      })));
      return arr;
    },
    swap: function swap() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var indexes = getIndexes(state, action);
      var arr = [].concat(_toConsumableArray(state));

      for (var i = indexes.length - 1; i >= 1; i--) {
        var index1 = indexes[i];
        var index2 = indexes.slice(i - 1)[0];
        var temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
      }

      return arr;
    },
    update: function update() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var _ref10 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var limit = _ref10.limit;
      var _ref10$skip = _ref10.skip;
      var skip = _ref10$skip === undefined ? 0 : _ref10$skip;
      var query = _ref10.query;

      var rest = _objectWithoutProperties(_ref10, ['limit', 'skip', 'query']);

      var result = [];
      for (var i = 0, updated = 0; i < state.length; i++) {
        if (i >= skip && updated < limit && matcher(state[i], query)) {
          result.push(reducer(state[i], rest));
          updated++;
        } else {
          result.push(state[i]);
        }
      }
      return result;
    },
    filter: function filter() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var _ref11 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var limit = _ref11.limit;
      var _ref11$skip = _ref11.skip;
      var skip = _ref11$skip === undefined ? 0 : _ref11$skip;
      var query = _ref11.query;


      var result = [];
      for (var i = 0, removed = 0; i < state.length; i++) {
        if (i < skip || removed >= limit || query !== undefined && !matcher(state[i], query)) {
          result.push(state[i]);
        } else {
          removed++;
        }
      }
      return result;
    },
    sort: function sort() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var actionArg = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var data = actionArg.data;
      var sortArgRaw = actionArg.sort;

      var rest = _objectWithoutProperties(actionArg, ['data', 'sort']);

      var sorter = data === undefined ? sortArgRaw : data;

      var _normalizeSortArgs = (0, _normalizers.normalizeSortArgs)(_extends({ sort: sorter }, rest));

      var sortArg = _normalizeSortArgs.sort;
      var orders = _normalizeSortArgs.orders;

      return sortBy(state, (0, _lib.sortTransform)(sortArg, orders), orders);
    }
  };
}

exports.default = collectorReducerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb2xsZWN0b3ItcmVkdWNlci1iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxTQUFTLGNBQVQsT0FBdUM7QUFBQSxNQUFkLEtBQWMsUUFBZCxLQUFjO0FBQUEsTUFBUCxJQUFPLFFBQVAsSUFBTzs7QUFDckMsU0FBTztBQUNMLGNBREs7QUFFTCxXQUFPLFFBQVE7QUFGVixHQUFQO0FBSUQ7O0FBRUQsU0FBUyxvQkFBVCxRQUErRztBQUFBLE1BQWhGLFdBQWdGLFNBQWhGLFdBQWdGO0FBQUEsTUFBbkUsT0FBbUUsU0FBbkUsT0FBbUU7QUFBQSxNQUExRCxVQUEwRCxTQUExRCxVQUEwRDtBQUFBLE1BQTlDLGNBQThDLFNBQTlDLGNBQThDO0FBQUEsTUFBOUIsT0FBOEIsU0FBOUIsT0FBOEI7QUFBQSxNQUFyQixVQUFxQixTQUFyQixVQUFxQjtBQUFBLE1BQVQsTUFBUyxTQUFULE1BQVM7O0FBQzdHLFNBQU87QUFDTCxPQURLLGlCQUMwRDtBQUFBLFVBQTNELEtBQTJELHlEQUFuRCxFQUFtRDs7QUFBQSx3RUFBSixFQUFJOztBQUFBLDZCQUE5QyxJQUE4QztBQUFBLFVBQTlDLElBQThDLDhCQUF2QyxNQUFNLE1BQWlDO0FBQUEsVUFBcEIsTUFBb0IsU0FBekIsR0FBeUI7QUFBQSxVQUFaLElBQVksU0FBWixJQUFZOzs7QUFFN0QsVUFBTSxNQUFNLFdBQVcsU0FBWCxHQUNSLElBRFEsR0FFUixNQUZKOztBQUlBLDBDQUFXLE1BQU0sS0FBTixDQUFZLENBQVosRUFBZSxJQUFmLENBQVgsSUFBaUMsV0FBVyxRQUFRLFNBQVIsR0FBb0IsV0FBcEIsR0FBa0MsR0FBN0MsRUFBa0QsT0FBTyxDQUF6RCxDQUFqQyxzQkFBaUcsTUFBTSxLQUFOLENBQVksSUFBWixFQUFrQixHQUFsQixDQUFzQixjQUF0QixDQUFqRztBQUNELEtBUkk7QUFTTCxZQVRLLHNCQVMrRDtBQUFBLFVB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YXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjb250YWlucywgc29ydFRyYW5zZm9ybX0gZnJvbSAnLi9saWInO1xuaW1wb3J0IHtub3JtYWxpemVTb3J0QXJnc30gZnJvbSAnLi9ub3JtYWxpemVycyc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5mdW5jdGlvbiBpbmNyZW1lbnRJbmRleCh7aW5kZXgsIGl0ZW19KSB7XG4gIHJldHVybiB7XG4gICAgaXRlbSxcbiAgICBpbmRleDogaW5kZXggKyAxXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RvclJlZHVjZXJCYXNlKHtpdGVtRGVmYXVsdCwgbWF0Y2hlciwgYWRkV3JhcHBlciwgZ2V0TW92ZUluZGV4ZXMsIHJlZHVjZXIsIGdldEluZGV4ZXMsIHNvcnRCeX0pIHtcbiAgcmV0dXJuIHtcbiAgICBhZGQoc3RhdGUgPSBbXSwge3NraXAgPSBzdGF0ZS5sZW5ndGgsIGFkZDogYWRkQXJnLCBkYXRhfSA9IHt9KSB7XG5cbiAgICAgIGNvbnN0IGFkZCA9IGFkZEFyZyA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gZGF0YVxuICAgICAgICA6IGFkZEFyZztcblxuICAgICAgcmV0dXJuIFsuLi5zdGF0ZS5zbGljZSgwLCBza2lwKSwgYWRkV3JhcHBlcihhZGQgPT09IHVuZGVmaW5lZCA/IGl0ZW1EZWZhdWx0IDogYWRkLCBza2lwICsgMSksIC4uLnN0YXRlLnNsaWNlKHNraXApLm1hcChpbmNyZW1lbnRJbmRleCldO1xuICAgIH0sXG4gICAgYWRkUmFuZ2Uoc3RhdGUgPSBbXSwge3NraXAgPSBzdGF0ZS5sZW5ndGgsIGFkZDogYWRkQXJnLCBkYXRhfSA9IHt9KSB7XG5cbiAgICAgIGxldCBhZGQgPSBhZGRBcmcgPT09IHVuZGVmaW5lZFxuICAgICAgICA/IGRhdGFcbiAgICAgICAgOiBhZGRBcmc7XG5cbiAgICAgIGlmICghXy5pc0FycmF5KGFkZCkpIHtcbiAgICAgICAgYWRkID0gW2FkZF07XG4gICAgICB9XG4gICAgICByZXR1cm4gW1xuICAgICAgICAuLi5zdGF0ZS5zbGljZSgwLCBza2lwKSxcbiAgICAgICAgLi4uYWRkLm1hcChpdGVtID0+IGl0ZW0gPT09IHVuZGVmaW5lZCA/IGl0ZW1EZWZhdWx0IDogaXRlbSkubWFwKChpdGVtLCBpKSA9PiBhZGRXcmFwcGVyKGl0ZW0sIHNraXAgKyBpKSksXG4gICAgICAgIC4uLnN0YXRlLnNsaWNlKHNraXApLm1hcChpbmNyZW1lbnRJbmRleClcbiAgICAgIF07XG4gICAgfSxcbiAgICBtb3ZlKHN0YXRlID0gW10sIGFjdGlvbiA9IHt9KSB7XG4gICAgICBjb25zdCB7dG8sIGZyb219ID0gZ2V0TW92ZUluZGV4ZXMoc3RhdGUsIGFjdGlvbik7XG5cbiAgICAgIGxldCBhcnIgPSBbLi4uc3RhdGVdO1xuICAgICAgY29uc3QgdG9JbmplY3QgPSBbXTtcblxuICAgICAgZm9yKGxldCBpID0gZnJvbS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBjb25zdCBmcm9tSW5kZXggPSBmcm9tW2ldO1xuICAgICAgICB0b0luamVjdC5wdXNoKHtpdGVtOiBhcnIuc3BsaWNlKGZyb21JbmRleCwgMSkucG9wKCksIGluZGV4OiBmcm9tSW5kZXh9KTtcbiAgICAgIH1cbiAgICAgIHRvSW5qZWN0LnJldmVyc2UoKTtcblxuXG4gICAgICBsZXQgc3RhdGVJbmRleCA9IHN0YXRlLm1hcCgoaXRlbSwgaW5kZXgpID0+ICh7aXRlbSwgaW5kZXh9KSk7XG5cbiAgICAgIGNvbnN0IG5vRnJvbUluZGV4ZXMgPSAoe2l0ZW0sIGluZGV4fSkgPT4gIWNvbnRhaW5zKHRvSW5qZWN0Lm1hcCgoe2luZGV4fSkgPT4gaW5kZXgpLCBpbmRleCk7XG5cbiAgICAgIGFyciA9IFtcbiAgICAgICAgLi4uc3RhdGVJbmRleC5zbGljZSgwLCB0bykuZmlsdGVyKG5vRnJvbUluZGV4ZXMpLm1hcCgoe2l0ZW19KSA9PiBpdGVtKSxcbiAgICAgICAgLi4udG9JbmplY3QubWFwKCh7aXRlbX0pID0+IGl0ZW0pLFxuICAgICAgICAuLi5zdGF0ZUluZGV4LnNsaWNlKHRvKS5maWx0ZXIobm9Gcm9tSW5kZXhlcykubWFwKCh7aXRlbX0pID0+IGl0ZW0pXG4gICAgICBdO1xuICAgICAgcmV0dXJuIGFycjtcbiAgICB9LFxuICAgIHN3YXAoc3RhdGUgPSBbXSwgYWN0aW9uID0ge30pIHtcbiAgICAgIGNvbnN0IGluZGV4ZXMgPSBnZXRJbmRleGVzKHN0YXRlLCBhY3Rpb24pO1xuICAgICAgbGV0IGFyciA9IFsuLi5zdGF0ZV07XG5cbiAgICAgIGZvcihsZXQgaSA9IGluZGV4ZXMubGVuZ3RoIC0gMTsgaSA+PSAxOyBpLS0pIHtcbiAgICAgICAgY29uc3QgaW5kZXgxID0gaW5kZXhlc1tpXTtcbiAgICAgICAgY29uc3QgaW5kZXgyID0gaW5kZXhlcy5zbGljZShpIC0gMSlbMF07XG4gICAgICAgIGNvbnN0IHRlbXAgPSBhcnJbaW5kZXgxXTtcbiAgICAgICAgYXJyW2luZGV4MV0gPSBhcnJbaW5kZXgyXTtcbiAgICAgICAgYXJyW2luZGV4Ml0gPSB0ZW1wO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYXJyO1xuICAgIH0sXG4gICAgdXBkYXRlKHN0YXRlID0gW10sIHtsaW1pdCwgc2tpcCA9IDAsIHF1ZXJ5LCAuLi5yZXN0fSA9IHt9KSB7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIHVwZGF0ZWQgPSAwOyBpIDwgc3RhdGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPj0gc2tpcCAmJiB1cGRhdGVkIDwgbGltaXQgJiYgbWF0Y2hlcihzdGF0ZVtpXSwgcXVlcnkpKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2gocmVkdWNlcihzdGF0ZVtpXSwgcmVzdCkpO1xuICAgICAgICAgIHVwZGF0ZWQgKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc3RhdGVbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgZmlsdGVyKHN0YXRlID0gW10sIHtsaW1pdCwgc2tpcCA9IDAsIHF1ZXJ5fSA9IHt9KSB7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIHJlbW92ZWQgPSAwOyBpIDwgc3RhdGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPCBza2lwIHx8IHJlbW92ZWQgPj0gbGltaXQgfHwgKHF1ZXJ5ICE9PSB1bmRlZmluZWQgJiYgIW1hdGNoZXIoc3RhdGVbaV0sIHF1ZXJ5KSkpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChzdGF0ZVtpXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVtb3ZlZCArKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIHNvcnQoc3RhdGUgPSBbXSwgYWN0aW9uQXJnID0ge30pIHtcbiAgICAgIGxldCB7ZGF0YSwgc29ydDogc29ydEFyZ1JhdywgLi4ucmVzdH0gPSBhY3Rpb25Bcmc7XG4gICAgICBjb25zdCBzb3J0ZXIgPSBkYXRhID09PSB1bmRlZmluZWRcbiAgICAgICAgPyBzb3J0QXJnUmF3XG4gICAgICAgIDogZGF0YTtcblxuICAgICAgY29uc3Qge3NvcnQ6IHNvcnRBcmcsIG9yZGVyc30gPSBub3JtYWxpemVTb3J0QXJncyh7c29ydDogc29ydGVyLCAuLi5yZXN0fSk7XG4gICAgICByZXR1cm4gc29ydEJ5KHN0YXRlLCBzb3J0VHJhbnNmb3JtKHNvcnRBcmcsIG9yZGVycyksIG9yZGVycyk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb2xsZWN0b3JSZWR1Y2VyQmFzZTtcbiJdfQ==