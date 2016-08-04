'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultMatcher = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultMatcher(arg, predicate) {
  if (predicate === undefined) {
    return true;
  } else if (_lodash2.default.isFunction(predicate)) {
    return predicate(arg);
  } else if (_lodash2.default.isBoolean(predicate)) {
    return predicate;
  } else if (!_lodash2.default.isPlainObject(predicate)) {
    return predicate === arg;
  } else {
    return _lodash2.default.isMatch(arg, predicate);
  }
}

exports.defaultMatcher = defaultMatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZhdWx0LXJlc29sdmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsU0FBUyxjQUFULENBQXdCLEdBQXhCLEVBQTZCLFNBQTdCLEVBQXdDO0FBQ3RDLE1BQUksY0FBYyxTQUFsQixFQUE2QjtBQUMzQixXQUFPLElBQVA7QUFDRCxHQUZELE1BRU8sSUFBSSxpQkFBRSxVQUFGLENBQWEsU0FBYixDQUFKLEVBQTZCO0FBQ2xDLFdBQU8sVUFBVSxHQUFWLENBQVA7QUFDRCxHQUZNLE1BRUEsSUFBRyxpQkFBRSxTQUFGLENBQVksU0FBWixDQUFILEVBQTJCO0FBQ2hDLFdBQU8sU0FBUDtBQUNELEdBRk0sTUFFQSxJQUFHLENBQUMsaUJBQUUsYUFBRixDQUFnQixTQUFoQixDQUFKLEVBQWdDO0FBQ3JDLFdBQU8sY0FBYyxHQUFyQjtBQUNELEdBRk0sTUFFQTtBQUNMLFdBQU8saUJBQUUsT0FBRixDQUFVLEdBQVYsRUFBZSxTQUFmLENBQVA7QUFDRDtBQUNGOztRQUVPLGMsR0FBQSxjIiwiZmlsZSI6ImRlZmF1bHQtcmVzb2x2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5mdW5jdGlvbiBkZWZhdWx0TWF0Y2hlcihhcmcsIHByZWRpY2F0ZSkge1xuICBpZiAocHJlZGljYXRlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24ocHJlZGljYXRlKSkge1xuICAgIHJldHVybiBwcmVkaWNhdGUoYXJnKTtcbiAgfSBlbHNlIGlmKF8uaXNCb29sZWFuKHByZWRpY2F0ZSkpIHtcbiAgICByZXR1cm4gcHJlZGljYXRlO1xuICB9IGVsc2UgaWYoIV8uaXNQbGFpbk9iamVjdChwcmVkaWNhdGUpKSB7XG4gICAgcmV0dXJuIHByZWRpY2F0ZSA9PT0gYXJnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfLmlzTWF0Y2goYXJnLCBwcmVkaWNhdGUpO1xuICB9XG59XG5cbmV4cG9ydCB7ZGVmYXVsdE1hdGNoZXJ9O1xuIl19