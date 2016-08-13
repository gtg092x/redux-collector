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
    return predicate === true ? !!arg : !arg;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZhdWx0LW1hdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxTQUFTLGNBQVQsQ0FBd0IsR0FBeEIsRUFBNkIsU0FBN0IsRUFBd0MsS0FBeEMsRUFBK0M7QUFDN0MsTUFBSSxjQUFjLFNBQWxCLEVBQTZCO0FBQzNCLFdBQU8sSUFBUDtBQUNELEdBRkQsTUFFTyxJQUFJLGlCQUFFLE9BQUYsQ0FBVSxTQUFWLENBQUosRUFBMEI7QUFDL0IsV0FBTyxpQkFBRSxLQUFGLENBQVEsU0FBUixFQUFtQjtBQUFBLGFBQVMsZUFBZSxHQUFmLEVBQW9CLEtBQXBCLEVBQTJCLEtBQTNCLENBQVQ7QUFBQSxLQUFuQixDQUFQO0FBQ0QsR0FGTSxNQUVBLElBQUksaUJBQUUsVUFBRixDQUFhLFNBQWIsQ0FBSixFQUE2QjtBQUNsQyxXQUFPLFVBQVUsR0FBVixFQUFlLEtBQWYsQ0FBUDtBQUNELEdBRk0sTUFFQSxJQUFHLGlCQUFFLFNBQUYsQ0FBWSxTQUFaLENBQUgsRUFBMkI7QUFDaEMsV0FBTyxjQUFjLElBQWQsR0FBcUIsQ0FBQyxDQUFDLEdBQXZCLEdBQTZCLENBQUMsR0FBckM7QUFDRCxHQUZNLE1BRUEsSUFBRyxDQUFDLGlCQUFFLGFBQUYsQ0FBZ0IsU0FBaEIsQ0FBSixFQUFnQztBQUNyQyxXQUFPLGNBQWMsR0FBckI7QUFDRCxHQUZNLE1BRUEsSUFBRyxVQUFVLEdBQWIsRUFBa0I7QUFDdkIsV0FBTyxpQkFBRSxJQUFGLENBQU8sVUFBVSxHQUFqQixFQUFzQjtBQUFBLGFBQVMsZUFBZSxHQUFmLEVBQW9CLEtBQXBCLEVBQTJCLEtBQTNCLENBQVQ7QUFBQSxLQUF0QixDQUFQO0FBQ0QsR0FGTSxNQUVBO0FBQ0wsV0FBTyxpQkFBRSxPQUFGLENBQVUsR0FBVixFQUFlLFNBQWYsQ0FBUDtBQUNEO0FBQ0Y7O1FBRU8sYyxHQUFBLGMiLCJmaWxlIjoiZGVmYXVsdC1tYXRjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuZnVuY3Rpb24gZGVmYXVsdE1hdGNoZXIoYXJnLCBwcmVkaWNhdGUsIGluZGV4KSB7XG4gIGlmIChwcmVkaWNhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKF8uaXNBcnJheShwcmVkaWNhdGUpKSB7XG4gICAgcmV0dXJuIF8uZXZlcnkocHJlZGljYXRlLCBxdWVyeSA9PiBkZWZhdWx0TWF0Y2hlcihhcmcsIHF1ZXJ5LCBpbmRleCkpO1xuICB9IGVsc2UgaWYgKF8uaXNGdW5jdGlvbihwcmVkaWNhdGUpKSB7XG4gICAgcmV0dXJuIHByZWRpY2F0ZShhcmcsIGluZGV4KTtcbiAgfSBlbHNlIGlmKF8uaXNCb29sZWFuKHByZWRpY2F0ZSkpIHtcbiAgICByZXR1cm4gcHJlZGljYXRlID09PSB0cnVlID8gISFhcmcgOiAhYXJnO1xuICB9IGVsc2UgaWYoIV8uaXNQbGFpbk9iamVjdChwcmVkaWNhdGUpKSB7XG4gICAgcmV0dXJuIHByZWRpY2F0ZSA9PT0gYXJnO1xuICB9IGVsc2UgaWYocHJlZGljYXRlLiRvcikge1xuICAgIHJldHVybiBfLnNvbWUocHJlZGljYXRlLiRvciwgcXVlcnkgPT4gZGVmYXVsdE1hdGNoZXIoYXJnLCBxdWVyeSwgaW5kZXgpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gXy5pc01hdGNoKGFyZywgcHJlZGljYXRlKTtcbiAgfVxufVxuXG5leHBvcnQge2RlZmF1bHRNYXRjaGVyfTtcbiJdfQ==