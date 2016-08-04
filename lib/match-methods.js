'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMoveIndexesBase = exports.getIndexesBase = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lib = require('./lib');

var _normalizers = require('./normalizers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getIndexesBase(indexesOf, state) {
  var action = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _normalizeIndexArgs = (0, _normalizers.normalizeIndexArgs)(action);

  var indexes = _normalizeIndexArgs.indexes;
  var ranges = _normalizeIndexArgs.ranges;
  var queries = _normalizeIndexArgs.queries;

  var result = [];

  if (indexes !== undefined) {
    result.push.apply(result, _toConsumableArray(indexes));
  }
  if (ranges !== undefined) {
    ranges.forEach(function (range) {
      var _range$map = range.map(_lib.clamp.bind(undefined, state.length));

      var _range$map2 = _slicedToArray(_range$map, 2);

      var start = _range$map2[0];
      var end = _range$map2[1];

      for (var i = start; i <= end; i++) {
        result.push(i);
      }
    });
  }
  if (queries !== undefined) {
    queries.forEach(function (query) {
      result.push.apply(result, _toConsumableArray(indexesOf(state, query)));
    });
  }
  return _lodash2.default.uniq(result);
}

function getMoveIndexesBase(indexesOf, state, action) {
  var getIndexes = getIndexesBase.bind(this, indexesOf);
  var fromArg = (0, _normalizers.normalizeFrom)(action.from);

  var from = getIndexes(state, fromArg);

  var toArg = (0, _normalizers.normalizeTo)(action.to);

  var to = _lodash2.default.first(getIndexes(state, toArg));
  return { from: from, to: to };
}

exports.getIndexesBase = getIndexesBase;
exports.getMoveIndexesBase = getMoveIndexesBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXRjaC1tZXRob2RzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7O0FBQ0E7Ozs7OztBQUVBLFNBQVMsY0FBVCxDQUF3QixTQUF4QixFQUFtQyxLQUFuQyxFQUF1RDtBQUFBLE1BQWIsTUFBYSx5REFBSixFQUFJOztBQUFBLDRCQUNsQixxQ0FBbUIsTUFBbkIsQ0FEa0I7O0FBQUEsTUFDOUMsT0FEOEMsdUJBQzlDLE9BRDhDO0FBQUEsTUFDckMsTUFEcUMsdUJBQ3JDLE1BRHFDO0FBQUEsTUFDN0IsT0FENkIsdUJBQzdCLE9BRDZCOztBQUVyRCxNQUFNLFNBQVMsRUFBZjs7QUFFQSxNQUFJLFlBQVksU0FBaEIsRUFBMkI7QUFDekIsV0FBTyxJQUFQLGtDQUFlLE9BQWY7QUFDRDtBQUNELE1BQUksV0FBVyxTQUFmLEVBQTBCO0FBQ3hCLFdBQU8sT0FBUCxDQUFlLGlCQUFTO0FBQUEsdUJBQ0QsTUFBTSxHQUFOLENBQVUsV0FBTSxJQUFOLENBQVcsU0FBWCxFQUFzQixNQUFNLE1BQTVCLENBQVYsQ0FEQzs7QUFBQTs7QUFBQSxVQUNmLEtBRGU7QUFBQSxVQUNSLEdBRFE7O0FBRXRCLFdBQUssSUFBSSxJQUFJLEtBQWIsRUFBb0IsS0FBSyxHQUF6QixFQUE4QixHQUE5QixFQUFvQztBQUNsQyxlQUFPLElBQVAsQ0FBWSxDQUFaO0FBQ0Q7QUFDRixLQUxEO0FBTUQ7QUFDRCxNQUFJLFlBQVksU0FBaEIsRUFBMkI7QUFDekIsWUFBUSxPQUFSLENBQWdCLGlCQUFTO0FBQ3ZCLGFBQU8sSUFBUCxrQ0FBZSxVQUFVLEtBQVYsRUFBaUIsS0FBakIsQ0FBZjtBQUNELEtBRkQ7QUFHRDtBQUNELFNBQU8saUJBQUUsSUFBRixDQUFPLE1BQVAsQ0FBUDtBQUNEOztBQUVELFNBQVMsa0JBQVQsQ0FBNkIsU0FBN0IsRUFBd0MsS0FBeEMsRUFBK0MsTUFBL0MsRUFBdUQ7QUFDckQsTUFBTSxhQUFhLGVBQWUsSUFBZixDQUFvQixJQUFwQixFQUEwQixTQUExQixDQUFuQjtBQUNBLE1BQU0sVUFBVSxnQ0FBYyxPQUFPLElBQXJCLENBQWhCOztBQUVBLE1BQU0sT0FBTyxXQUFXLEtBQVgsRUFBa0IsT0FBbEIsQ0FBYjs7QUFFQSxNQUFNLFFBQVEsOEJBQVksT0FBTyxFQUFuQixDQUFkOztBQUVBLE1BQU0sS0FBSyxpQkFBRSxLQUFGLENBQVEsV0FBVyxLQUFYLEVBQWtCLEtBQWxCLENBQVIsQ0FBWDtBQUNBLFNBQU8sRUFBQyxVQUFELEVBQU8sTUFBUCxFQUFQO0FBQ0Q7O1FBRU8sYyxHQUFBLGM7UUFBZ0Isa0IsR0FBQSxrQiIsImZpbGUiOiJtYXRjaC1tZXRob2RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHtjbGFtcH0gZnJvbSAnLi9saWInO1xuaW1wb3J0IHtub3JtYWxpemVJbmRleEFyZ3MsIG5vcm1hbGl6ZUZyb20sIG5vcm1hbGl6ZVRvfSBmcm9tICcuL25vcm1hbGl6ZXJzJztcblxuZnVuY3Rpb24gZ2V0SW5kZXhlc0Jhc2UoaW5kZXhlc09mLCBzdGF0ZSwgYWN0aW9uID0ge30pIHtcbiAgY29uc3Qge2luZGV4ZXMsIHJhbmdlcywgcXVlcmllc30gPSBub3JtYWxpemVJbmRleEFyZ3MoYWN0aW9uKTtcbiAgY29uc3QgcmVzdWx0ID0gW107XG5cbiAgaWYgKGluZGV4ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIHJlc3VsdC5wdXNoKC4uLmluZGV4ZXMpO1xuICB9XG4gIGlmIChyYW5nZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIHJhbmdlcy5mb3JFYWNoKHJhbmdlID0+IHtcbiAgICAgIGNvbnN0IFtzdGFydCwgZW5kXSA9IHJhbmdlLm1hcChjbGFtcC5iaW5kKHVuZGVmaW5lZCwgc3RhdGUubGVuZ3RoKSk7XG4gICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpICsrKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChxdWVyaWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBxdWVyaWVzLmZvckVhY2gocXVlcnkgPT4ge1xuICAgICAgcmVzdWx0LnB1c2goLi4uaW5kZXhlc09mKHN0YXRlLCBxdWVyeSkpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBfLnVuaXEocmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gZ2V0TW92ZUluZGV4ZXNCYXNlIChpbmRleGVzT2YsIHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3QgZ2V0SW5kZXhlcyA9IGdldEluZGV4ZXNCYXNlLmJpbmQodGhpcywgaW5kZXhlc09mKTtcbiAgY29uc3QgZnJvbUFyZyA9IG5vcm1hbGl6ZUZyb20oYWN0aW9uLmZyb20pO1xuXG4gIGNvbnN0IGZyb20gPSBnZXRJbmRleGVzKHN0YXRlLCBmcm9tQXJnKTtcblxuICBjb25zdCB0b0FyZyA9IG5vcm1hbGl6ZVRvKGFjdGlvbi50byk7XG5cbiAgY29uc3QgdG8gPSBfLmZpcnN0KGdldEluZGV4ZXMoc3RhdGUsIHRvQXJnKSk7XG4gIHJldHVybiB7ZnJvbSwgdG99O1xufVxuXG5leHBvcnQge2dldEluZGV4ZXNCYXNlLCBnZXRNb3ZlSW5kZXhlc0Jhc2V9O1xuIl19