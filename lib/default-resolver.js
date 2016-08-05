'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultMatcher = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultMatcher(arg, predicate, index) {
  if (predicate === undefined) {
    return true;
  } else if (_lodash2.default.isArray(predicate)) {
    return _lodash2.default.every(predicate, function (query) {
      return defaultMatcher(arg, query, index);
    });
  } else if (_lodash2.default.isFunction(predicate)) {
    return predicate(arg, index);
  } else if (_lodash2.default.isBoolean(predicate)) {
    return predicate;
  } else if (!_lodash2.default.isPlainObject(predicate)) {
    return predicate === arg;
  } else if (predicate.$or) {
    return _lodash2.default.some(predicate.$or, function (query) {
      return defaultMatcher(arg, query, index);
    });
  } else {
    return _lodash2.default.isMatch(arg, predicate);
  }
}

exports.defaultMatcher = defaultMatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZhdWx0LXJlc29sdmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsU0FBUyxjQUFULENBQXdCLEdBQXhCLEVBQTZCLFNBQTdCLEVBQXdDLEtBQXhDLEVBQStDO0FBQzdDLE1BQUksY0FBYyxTQUFsQixFQUE2QjtBQUMzQixXQUFPLElBQVA7QUFDRCxHQUZELE1BRU8sSUFBSSxpQkFBRSxPQUFGLENBQVUsU0FBVixDQUFKLEVBQTBCO0FBQy9CLFdBQU8saUJBQUUsS0FBRixDQUFRLFNBQVIsRUFBbUI7QUFBQSxhQUFTLGVBQWUsR0FBZixFQUFvQixLQUFwQixFQUEyQixLQUEzQixDQUFUO0FBQUEsS0FBbkIsQ0FBUDtBQUNELEdBRk0sTUFFQSxJQUFJLGlCQUFFLFVBQUYsQ0FBYSxTQUFiLENBQUosRUFBNkI7QUFDbEMsV0FBTyxVQUFVLEdBQVYsRUFBZSxLQUFmLENBQVA7QUFDRCxHQUZNLE1BRUEsSUFBRyxpQkFBRSxTQUFGLENBQVksU0FBWixDQUFILEVBQTJCO0FBQ2hDLFdBQU8sU0FBUDtBQUNELEdBRk0sTUFFQSxJQUFHLENBQUMsaUJBQUUsYUFBRixDQUFnQixTQUFoQixDQUFKLEVBQWdDO0FBQ3JDLFdBQU8sY0FBYyxHQUFyQjtBQUNELEdBRk0sTUFFQSxJQUFHLFVBQVUsR0FBYixFQUFrQjtBQUN2QixXQUFPLGlCQUFFLElBQUYsQ0FBTyxVQUFVLEdBQWpCLEVBQXNCO0FBQUEsYUFBUyxlQUFlLEdBQWYsRUFBb0IsS0FBcEIsRUFBMkIsS0FBM0IsQ0FBVDtBQUFBLEtBQXRCLENBQVA7QUFDRCxHQUZNLE1BRUE7QUFDTCxXQUFPLGlCQUFFLE9BQUYsQ0FBVSxHQUFWLEVBQWUsU0FBZixDQUFQO0FBQ0Q7QUFDRjs7UUFFTyxjLEdBQUEsYyIsImZpbGUiOiJkZWZhdWx0LXJlc29sdmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuZnVuY3Rpb24gZGVmYXVsdE1hdGNoZXIoYXJnLCBwcmVkaWNhdGUsIGluZGV4KSB7XG4gIGlmIChwcmVkaWNhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKF8uaXNBcnJheShwcmVkaWNhdGUpKSB7XG4gICAgcmV0dXJuIF8uZXZlcnkocHJlZGljYXRlLCBxdWVyeSA9PiBkZWZhdWx0TWF0Y2hlcihhcmcsIHF1ZXJ5LCBpbmRleCkpO1xuICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihwcmVkaWNhdGUpKSB7XG4gICAgcmV0dXJuIHByZWRpY2F0ZShhcmcsIGluZGV4KTtcbiAgfSBlbHNlIGlmKF8uaXNCb29sZWFuKHByZWRpY2F0ZSkpIHtcbiAgICByZXR1cm4gcHJlZGljYXRlO1xuICB9IGVsc2UgaWYoIV8uaXNQbGFpbk9iamVjdChwcmVkaWNhdGUpKSB7XG4gICAgcmV0dXJuIHByZWRpY2F0ZSA9PT0gYXJnO1xuICB9IGVsc2UgaWYocHJlZGljYXRlLiRvcikge1xuICAgIHJldHVybiBfLnNvbWUocHJlZGljYXRlLiRvciwgcXVlcnkgPT4gZGVmYXVsdE1hdGNoZXIoYXJnLCBxdWVyeSwgaW5kZXgpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXy5pc01hdGNoKGFyZywgcHJlZGljYXRlKTtcbiAgfVxufVxuXG5leHBvcnQge2RlZmF1bHRNYXRjaGVyfTtcbiJdfQ==