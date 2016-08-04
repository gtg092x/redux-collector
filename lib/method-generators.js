'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateIndexof = exports.generateIndexesOf = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateIndexesOf(matcher) {
  return function generatedIndexesOf(state, query) {
    var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var _ref$skip = _ref.skip;
    var skip = _ref$skip === undefined ? 0 : _ref$skip;
    var _ref$limit = _ref.limit;
    var limit = _ref$limit === undefined ? state.length : _ref$limit;

    var indexes = [];
    for (var i = skip; indexes.length < limit && i < state.length; i++) {
      if (matcher(state[i], query)) {
        indexes.push(i);
      }
    }
    return indexes;
  };
}

function generateIndexof(indexesOf) {
  return function generatedIndexOf(arr, query) {
    var skip = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    var indexes = indexesOf(arr, query, { skip: skip, limit: 1 });
    var index = _lodash2.default.first(indexes);
    return index === undefined ? -1 : index;
  };
}

exports.generateIndexesOf = generateIndexesOf;
exports.generateIndexof = generateIndexof;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tZXRob2QtZ2VuZXJhdG9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUVBLFNBQVMsaUJBQVQsQ0FBMkIsT0FBM0IsRUFBb0M7QUFDbEMsU0FBTyxTQUFTLGtCQUFULENBQTZCLEtBQTdCLEVBQW9DLEtBQXBDLEVBQWtGO0FBQUEscUVBQUosRUFBSTs7QUFBQSx5QkFBdEMsSUFBc0M7QUFBQSxRQUF0QyxJQUFzQyw2QkFBL0IsQ0FBK0I7QUFBQSwwQkFBNUIsS0FBNEI7QUFBQSxRQUE1QixLQUE0Qiw4QkFBcEIsTUFBTSxNQUFjOztBQUN2RixRQUFNLFVBQVUsRUFBaEI7QUFDQSxTQUFLLElBQUksSUFBSSxJQUFiLEVBQW1CLFFBQVEsTUFBUixHQUFpQixLQUFqQixJQUEwQixJQUFJLE1BQU0sTUFBdkQsRUFBK0QsR0FBL0QsRUFBcUU7QUFDbkUsVUFBSSxRQUFRLE1BQU0sQ0FBTixDQUFSLEVBQWtCLEtBQWxCLENBQUosRUFBOEI7QUFDNUIsZ0JBQVEsSUFBUixDQUFhLENBQWI7QUFDRDtBQUNGO0FBQ0QsV0FBTyxPQUFQO0FBQ0QsR0FSRDtBQVNEOztBQUVELFNBQVMsZUFBVCxDQUF5QixTQUF6QixFQUFvQztBQUNsQyxTQUFPLFNBQVMsZ0JBQVQsQ0FBMkIsR0FBM0IsRUFBZ0MsS0FBaEMsRUFBaUQ7QUFBQSxRQUFWLElBQVUseURBQUgsQ0FBRzs7QUFDdEQsUUFBTSxVQUFVLFVBQVUsR0FBVixFQUFlLEtBQWYsRUFBc0IsRUFBQyxVQUFELEVBQU8sT0FBTyxDQUFkLEVBQXRCLENBQWhCO0FBQ0EsUUFBTSxRQUFRLGlCQUFFLEtBQUYsQ0FBUSxPQUFSLENBQWQ7QUFDQSxXQUFPLFVBQVUsU0FBVixHQUFzQixDQUFDLENBQXZCLEdBQTJCLEtBQWxDO0FBQ0QsR0FKRDtBQUtEOztRQUVPLGlCLEdBQUEsaUI7UUFBbUIsZSxHQUFBLGUiLCJmaWxlIjoibWV0aG9kLWdlbmVyYXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUluZGV4ZXNPZihtYXRjaGVyKSB7XG4gIHJldHVybiBmdW5jdGlvbiBnZW5lcmF0ZWRJbmRleGVzT2YgKHN0YXRlLCBxdWVyeSwge3NraXAgPSAwLCBsaW1pdCA9IHN0YXRlLmxlbmd0aH0gPSB7fSkge1xuICAgIGNvbnN0IGluZGV4ZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gc2tpcDsgaW5kZXhlcy5sZW5ndGggPCBsaW1pdCAmJiBpIDwgc3RhdGUubGVuZ3RoOyBpICsrKSB7XG4gICAgICBpZiAobWF0Y2hlcihzdGF0ZVtpXSwgcXVlcnkpKSB7XG4gICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluZGV4ZXM7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlSW5kZXhvZihpbmRleGVzT2YpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGdlbmVyYXRlZEluZGV4T2YgKGFyciwgcXVlcnksIHNraXAgPSAwKSB7XG4gICAgY29uc3QgaW5kZXhlcyA9IGluZGV4ZXNPZihhcnIsIHF1ZXJ5LCB7c2tpcCwgbGltaXQ6IDF9KTtcbiAgICBjb25zdCBpbmRleCA9IF8uZmlyc3QoaW5kZXhlcyk7XG4gICAgcmV0dXJuIGluZGV4ID09PSB1bmRlZmluZWQgPyAtMSA6IGluZGV4O1xuICB9O1xufVxuXG5leHBvcnQge2dlbmVyYXRlSW5kZXhlc09mLCBnZW5lcmF0ZUluZGV4b2Z9O1xuIl19