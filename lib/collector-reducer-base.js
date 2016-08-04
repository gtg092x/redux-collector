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
        if (i >= skip && updated < limit && matcher(state[i], query, i)) {
          result.push(reducer(state[i], rest));
          updated++;
        } else {
          result.push(state[i]);
        }
      }
      return result;
    },
    hydrate: function hydrate() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var _ref11 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var data = _ref11.data;
      var _ref11$skip = _ref11.skip;
      var skip = _ref11$skip === undefined ? 0 : _ref11$skip;

      var setArg = data;

      if (!_lodash2.default.isArray(setArg)) {
        setArg = [setArg];
      }

      return [].concat(_toConsumableArray(state.slice(0, skip)), _toConsumableArray(setArg.map(function (item, i) {
        return addWrapper(item, skip + i);
      })));
    },
    filter: function filter() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var _ref12 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var limit = _ref12.limit;
      var _ref12$skip = _ref12.skip;
      var skip = _ref12$skip === undefined ? 0 : _ref12$skip;
      var query = _ref12.query;


      var result = [];
      for (var i = 0, removed = 0; i < state.length; i++) {
        if (i < skip || removed >= limit || query !== undefined && !matcher(state[i], query, i)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb2xsZWN0b3ItcmVkdWNlci1iYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxTQUFTLGNBQVQsT0FBdUM7QUFBQSxNQUFkLEtBQWMsUUFBZCxLQUFjO0FBQUEsTUFBUCxJQUFPLFFBQVAsSUFBTzs7QUFDckMsU0FBTztBQUNMLGNBREs7QUFFTCxXQUFPLFFBQVE7QUFGVixHQUFQO0FBSUQ7O0FBRUQsU0FBUyxvQkFBVCxRQUErRztBQUFBLE1BQWhGLFdBQWdGLFNBQWhGLFdBQWdGO0FBQUEsTUFBbkUsT0FBbUUsU0FBbkUsT0FBbUU7QUFBQSxNQUExRCxVQUEwRCxTQUExRCxVQUEwRDtBQUFBLE1BQTlDLGNBQThDLFNBQTlDLGNBQThDO0FBQUEsTUFBOUIsT0FBOEIsU0FBOUIsT0FBOEI7QUFBQSxNQUFyQixVQUFxQixTQUFyQixVQUFxQjtBQUFBLE1BQVQsTUFBUyxTQUFULE1BQVM7OztBQUk3RyxTQUFPO0FBQ0wsT0FESyxpQkFDMEQ7QUFBQSxVQUEzRCxLQUEyRCx5REFBbkQsRUFBbUQ7O0FBQUEsd0VBQUosRUFBSTs7QUFBQSw2QkFBOUMsSUFBOEM7QUFBQSxVQUE5QyxJQUE4Qyw4QkFBdkMsTUFBTSxNQUFpQztBQUFBLFVBQXBCLE1BQW9CLFNBQXpCLEdBQXlCO0FBQUEsVUFBWixJQUFZLFNBQVosSUFBWTs7O0FBRTdELFVBQU0sTUFBTSxXQUFXLFNBQVgsR0FDUixJQURRLEdBRVIsTUFGSjs7QUFJQSwwQ0FBVyxNQUFNLEtBQU4sQ0FBWSxDQUFaLEVBQWUsSUFBZixDQUFYLElBQWlDLFdBQVcsUUFBUSxTQUFSLEdBQW9CLFdBQXBCLEdBQWtDLEdBQTdDLEVBQWtELE9BQU8sQ0FBekQsQ0FBakMsc0JBQWlHLE1BQU0sS0FBTixDQUFZLElBQVosRUFBa0IsR0FBbEIsQ0FBc0IsY0FBdEIsQ0FBakc7QUFDRCxLQVJJO0FBU0wsWUFUSyxzQkFTK0Q7QUFBQSxV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QUFwQixFQUFvQjtBQUFBLFVBQWhCLFNBQWdCLHlEQUFKLEVBQUk7QUFBQSxVQUMxQixJQUQwQixHQUNTLFNBRFQsQ0FDMUIsSUFEMEI7QUFBQSxVQUNkLFVBRGMsR0FDUyxTQURULENBQ3BCLElBRG9COztBQUFBLFVBQ0MsSUFERCw0QkFDUyxTQURUOztBQUUvQixVQUFNLFNBQVMsU0FBUyxTQUFULEdBQ1gsVUFEVyxHQUVYLElBRko7O0FBRitCLCtCQU1DLCtDQUFtQixNQUFNLE1BQXpCLElBQW9DLElBQXBDLEVBTkQ7O0FBQUEsVUFNbEIsT0FOa0Isc0JBTXhCLElBTndCO0FBQUEsVUFNVCxNQU5TLHNCQU1ULE1BTlM7O0FBTy9CLGFBQU8sT0FBTyxLQUFQLEVBQWMsd0JBQWMsT0FBZCxFQUF1QixNQUF2QixDQUFkLEVBQThDLE1BQTlDLENBQVA7QUFDRDtBQTNHSSxHQUFQO0FBNkdEOztrQkFFYyxvQiIsImZpbGUiOiJjb2xsZWN0b3ItcmVkdWNlci1iYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjb250YWlucywgc29ydFRyYW5zZm9ybX0gZnJvbSAnLi9saWInO1xuaW1wb3J0IHtub3JtYWxpemVTb3J0QXJnc30gZnJvbSAnLi9ub3JtYWxpemVycyc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5mdW5jdGlvbiBpbmNyZW1lbnRJbmRleCh7aW5kZXgsIGl0ZW19KSB7XG4gIHJldHVybiB7XG4gICAgaXRlbSxcbiAgICBpbmRleDogaW5kZXggKyAxXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RvclJlZHVjZXJCYXNlKHtpdGVtRGVmYXVsdCwgbWF0Y2hlciwgYWRkV3JhcHBlciwgZ2V0TW92ZUluZGV4ZXMsIHJlZHVjZXIsIGdldEluZGV4ZXMsIHNvcnRCeX0pIHtcblxuXG5cbiAgcmV0dXJuIHtcbiAgICBhZGQoc3RhdGUgPSBbXSwge3NraXAgPSBzdGF0ZS5sZW5ndGgsIGFkZDogYWRkQXJnLCBkYXRhfSA9IHt9KSB7XG5cbiAgICAgIGNvbnN0IGFkZCA9IGFkZEFyZyA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gZGF0YVxuICAgICAgICA6IGFkZEFyZztcblxuICAgICAgcmV0dXJuIFsuLi5zdGF0ZS5zbGljZSgwLCBza2lwKSwgYWRkV3JhcHBlcihhZGQgPT09IHVuZGVmaW5lZCA/IGl0ZW1EZWZhdWx0IDogYWRkLCBza2lwICsgMSksIC4uLnN0YXRlLnNsaWNlKHNraXApLm1hcChpbmNyZW1lbnRJbmRleCldO1xuICAgIH0sXG4gICAgYWRkUmFuZ2Uoc3RhdGUgPSBbXSwge3NraXAgPSBzdGF0ZS5sZW5ndGgsIGFkZDogYWRkQXJnLCBkYXRhfSA9IHt9KSB7XG5cbiAgICAgIGxldCBhZGQgPSBhZGRBcmcgPT09IHVuZGVmaW5lZFxuICAgICAgICA/IGRhdGFcbiAgICAgICAgOiBhZGRBcmc7XG5cbiAgICAgIGlmICghXy5pc0FycmF5KGFkZCkpIHtcbiAgICAgICAgYWRkID0gW2FkZF07XG4gICAgICB9XG4gICAgICByZXR1cm4gW1xuICAgICAgICAuLi5zdGF0ZS5zbGljZSgwLCBza2lwKSxcbiAgICAgICAgLi4uYWRkLm1hcChpdGVtID0+IGl0ZW0gPT09IHVuZGVmaW5lZCA/IGl0ZW1EZWZhdWx0IDogaXRlbSkubWFwKChpdGVtLCBpKSA9PiBhZGRXcmFwcGVyKGl0ZW0sIHNraXAgKyBpKSksXG4gICAgICAgIC4uLnN0YXRlLnNsaWNlKHNraXApLm1hcChpbmNyZW1lbnRJbmRleClcbiAgICAgIF07XG4gICAgfSxcbiAgICBtb3ZlKHN0YXRlID0gW10sIGFjdGlvbiA9IHt9KSB7XG4gICAgICBjb25zdCB7dG8sIGZyb219ID0gZ2V0TW92ZUluZGV4ZXMoc3RhdGUsIGFjdGlvbik7XG5cbiAgICAgIGxldCBhcnIgPSBbLi4uc3RhdGVdO1xuICAgICAgY29uc3QgdG9JbmplY3QgPSBbXTtcblxuICAgICAgZm9yKGxldCBpID0gZnJvbS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBjb25zdCBmcm9tSW5kZXggPSBmcm9tW2ldO1xuICAgICAgICB0b0luamVjdC5wdXNoKHtpdGVtOiBhcnIuc3BsaWNlKGZyb21JbmRleCwgMSkucG9wKCksIGluZGV4OiBmcm9tSW5kZXh9KTtcbiAgICAgIH1cbiAgICAgIHRvSW5qZWN0LnJldmVyc2UoKTtcblxuXG4gICAgICBsZXQgc3RhdGVJbmRleCA9IHN0YXRlLm1hcCgoaXRlbSwgaW5kZXgpID0+ICh7aXRlbSwgaW5kZXh9KSk7XG5cbiAgICAgIGNvbnN0IG5vRnJvbUluZGV4ZXMgPSAoe2l0ZW0sIGluZGV4fSkgPT4gIWNvbnRhaW5zKHRvSW5qZWN0Lm1hcCgoe2luZGV4fSkgPT4gaW5kZXgpLCBpbmRleCk7XG5cbiAgICAgIGFyciA9IFtcbiAgICAgICAgLi4uc3RhdGVJbmRleC5zbGljZSgwLCB0bykuZmlsdGVyKG5vRnJvbUluZGV4ZXMpLm1hcCgoe2l0ZW19KSA9PiBpdGVtKSxcbiAgICAgICAgLi4udG9JbmplY3QubWFwKCh7aXRlbX0pID0+IGl0ZW0pLFxuICAgICAgICAuLi5zdGF0ZUluZGV4LnNsaWNlKHRvKS5maWx0ZXIobm9Gcm9tSW5kZXhlcykubWFwKCh7aXRlbX0pID0+IGl0ZW0pXG4gICAgICBdO1xuICAgICAgcmV0dXJuIGFycjtcbiAgICB9LFxuICAgIHN3YXAoc3RhdGUgPSBbXSwgYWN0aW9uID0ge30pIHtcbiAgICAgIGNvbnN0IGluZGV4ZXMgPSBnZXRJbmRleGVzKHN0YXRlLCBhY3Rpb24pO1xuICAgICAgbGV0IGFyciA9IFsuLi5zdGF0ZV07XG5cbiAgICAgIGZvcihsZXQgaSA9IGluZGV4ZXMubGVuZ3RoIC0gMTsgaSA+PSAxOyBpLS0pIHtcbiAgICAgICAgY29uc3QgaW5kZXgxID0gaW5kZXhlc1tpXTtcbiAgICAgICAgY29uc3QgaW5kZXgyID0gaW5kZXhlcy5zbGljZShpIC0gMSlbMF07XG4gICAgICAgIGNvbnN0IHRlbXAgPSBhcnJbaW5kZXgxXTtcbiAgICAgICAgYXJyW2luZGV4MV0gPSBhcnJbaW5kZXgyXTtcbiAgICAgICAgYXJyW2luZGV4Ml0gPSB0ZW1wO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYXJyO1xuICAgIH0sXG4gICAgdXBkYXRlKHN0YXRlID0gW10sIHtsaW1pdCwgc2tpcCA9IDAsIHF1ZXJ5LCAuLi5yZXN0fSA9IHt9KSB7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIHVwZGF0ZWQgPSAwOyBpIDwgc3RhdGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPj0gc2tpcCAmJiB1cGRhdGVkIDwgbGltaXQgJiYgbWF0Y2hlcihzdGF0ZVtpXSwgcXVlcnksIGkpKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2gocmVkdWNlcihzdGF0ZVtpXSwgcmVzdCkpO1xuICAgICAgICAgIHVwZGF0ZWQgKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc3RhdGVbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgaHlkcmF0ZShzdGF0ZSA9IFtdLCB7ZGF0YSwgc2tpcCA9IDB9ID0ge30pIHtcbiAgICAgIGxldCBzZXRBcmcgPSBkYXRhO1xuXG4gICAgICBpZiAoIV8uaXNBcnJheShzZXRBcmcpKSB7XG4gICAgICAgIHNldEFyZyA9IFtzZXRBcmddO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gW1xuICAgICAgICAuLi5zdGF0ZS5zbGljZSgwLCBza2lwKSxcbiAgICAgICAgLi4uc2V0QXJnLm1hcCgoaXRlbSwgaSkgPT4gYWRkV3JhcHBlcihpdGVtLCBza2lwICsgaSkpXG4gICAgICBdO1xuICAgIH0sXG4gICAgZmlsdGVyKHN0YXRlID0gW10sIHtsaW1pdCwgc2tpcCA9IDAsIHF1ZXJ5fSA9IHt9KSB7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIHJlbW92ZWQgPSAwOyBpIDwgc3RhdGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPCBza2lwIHx8IHJlbW92ZWQgPj0gbGltaXQgfHwgKHF1ZXJ5ICE9PSB1bmRlZmluZWQgJiYgIW1hdGNoZXIoc3RhdGVbaV0sIHF1ZXJ5LCBpKSkpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChzdGF0ZVtpXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVtb3ZlZCArKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIHNvcnQoc3RhdGUgPSBbXSwgYWN0aW9uQXJnID0ge30pIHtcbiAgICAgIGxldCB7ZGF0YSwgc29ydDogc29ydEFyZ1JhdywgLi4ucmVzdH0gPSBhY3Rpb25Bcmc7XG4gICAgICBjb25zdCBzb3J0ZXIgPSBkYXRhID09PSB1bmRlZmluZWRcbiAgICAgICAgPyBzb3J0QXJnUmF3XG4gICAgICAgIDogZGF0YTtcblxuICAgICAgY29uc3Qge3NvcnQ6IHNvcnRBcmcsIG9yZGVyc30gPSBub3JtYWxpemVTb3J0QXJncyh7c29ydDogc29ydGVyLCAuLi5yZXN0fSk7XG4gICAgICByZXR1cm4gc29ydEJ5KHN0YXRlLCBzb3J0VHJhbnNmb3JtKHNvcnRBcmcsIG9yZGVycyksIG9yZGVycyk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb2xsZWN0b3JSZWR1Y2VyQmFzZTtcbiJdfQ==