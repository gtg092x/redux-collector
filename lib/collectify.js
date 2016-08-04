'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clamp = exports.configureCollectify = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _collectorReducers = require('./collector-reducers');

var _collectorReducers2 = _interopRequireDefault(_collectorReducers);

var _lib = require('./lib');

var _reducify = require('reducify');

var _reducify2 = _interopRequireDefault(_reducify);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkReducerArg(arg) {
  if (arg.$ || arg.select) {
    throw '[Redux Pipeline] - The top level of this reducer must be an array. Make this reducer a child of a pipeline reducer with a selector. http://redux-collector.mediadrake.com/#gotchas';
  }
  return true;
}

function configureCollectify() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


  return function collectify() {
    for (var _len = arguments.length, config = Array(_len), _key = 0; _key < _len; _key++) {
      config[_key] = arguments[_key];
    }

    var _config$reverse = config.reverse();

    var _config$reverse2 = _slicedToArray(_config$reverse, 2);

    var _config$reverse2$ = _config$reverse2[0];
    _config$reverse2$ = _config$reverse2$ === undefined ? {} : _config$reverse2$;
    var itemDefaultArg = _config$reverse2$.itemDefault;
    var _config$reverse2$$col = _config$reverse2$.collectionDefault;
    var collectionDefault = _config$reverse2$$col === undefined ? [] : _config$reverse2$$col;
    var _config$reverse2$$add = _config$reverse2$.add;
    var add = _config$reverse2$$add === undefined ? '@@/COLLECTOR_ADD' : _config$reverse2$$add;
    var _config$reverse2$$mov = _config$reverse2$.move;
    var move = _config$reverse2$$mov === undefined ? '@@/COLLECTOR_MOVE' : _config$reverse2$$mov;
    var _config$reverse2$$swa = _config$reverse2$.swap;
    var swap = _config$reverse2$$swa === undefined ? '@@/COLLECTOR_SWAP' : _config$reverse2$$swa;
    var _config$reverse2$$add2 = _config$reverse2$.addRange;
    var addRange = _config$reverse2$$add2 === undefined ? '@@/COLLECTOR_ADD_RANGE' : _config$reverse2$$add2;
    var _config$reverse2$$rem = _config$reverse2$.remove;
    var remove = _config$reverse2$$rem === undefined ? '@@/COLLECTOR_REMOVE' : _config$reverse2$$rem;
    var _config$reverse2$$hyd = _config$reverse2$.hydrate;
    var hydrate = _config$reverse2$$hyd === undefined ? '@@/COLLECTOR_HYDRATE' : _config$reverse2$$hyd;
    var _config$reverse2$$sor = _config$reverse2$.sort;
    var sort = _config$reverse2$$sor === undefined ? '@@/COLLECTOR_SORT' : _config$reverse2$$sor;
    var _config$reverse2$2 = _config$reverse2[1];
    var reducerArg = _config$reverse2$2 === undefined ? [] : _config$reverse2$2;


    var itemDefault = itemDefaultArg === undefined ? reducerArg.defaultsTo : itemDefaultArg;

    var reducer = (0, _reducify2.default)(_lodash2.default.isPlainObject(reducerArg) ? checkReducerArg(reducerArg) && _extends({}, reducerArg, { defaultsTo: [] }) : reducerArg);

    var $$collector = (0, _collectorReducers2.default)(options, { itemDefault: itemDefault, reducer: reducer });

    return function reduxCollector() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? collectionDefault : arguments[0];
      var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      for (var _len2 = arguments.length, rest = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        rest[_key2 - 2] = arguments[_key2];
      }

      switch (action.type) {
        case add:
          return $$collector.add.apply($$collector, [state, action].concat(rest));
        case sort:
          return $$collector.sort.apply($$collector, [state, action].concat(rest));
        case addRange:
          return $$collector.addRange.apply($$collector, [state, action].concat(rest));
        case remove:
          return $$collector.filter.apply($$collector, [state, action].concat(rest));
        case move:
          return $$collector.move.apply($$collector, [state, action].concat(rest));
        case hydrate:
          return $$collector.hydrate.apply($$collector, [state, action].concat(rest));
        case swap:
          return $$collector.swap.apply($$collector, [state, action].concat(rest));
        default:
          return $$collector.update.apply($$collector, [state, action].concat(rest));
      }
    };
  };
}

exports.default = configureCollectify();
exports.configureCollectify = configureCollectify;
exports.clamp = _lib.clamp;
//# sourceMappingURL=data:application/json;base64,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WSxNQUFaLHFCQUFtQixLQUFuQixFQUEwQixNQUExQixTQUFxQyxJQUFyQyxFQUFQO0FBaEJKO0FBa0JELEtBbkJEO0FBb0JELEdBMUNEO0FBMkNEOztrQkFFYyxxQjtRQUNQLG1CLEdBQUEsbUI7UUFBcUIsSyIsImZpbGUiOiJjb2xsZWN0aWZ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZVJlZHVjZXJzIGZyb20gJy4vY29sbGVjdG9yLXJlZHVjZXJzJztcbmltcG9ydCB7Y2xhbXB9IGZyb20gJy4vbGliJztcbmltcG9ydCByZWR1Y2lmeSBmcm9tICdyZWR1Y2lmeSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5mdW5jdGlvbiBjaGVja1JlZHVjZXJBcmcoYXJnKSB7XG4gIGlmIChhcmcuJCB8fCBhcmcuc2VsZWN0KSB7XG4gICAgdGhyb3cgJ1tSZWR1eCBQaXBlbGluZV0gLSBUaGUgdG9wIGxldmVsIG9mIHRoaXMgcmVkdWNlciBtdXN0IGJlIGFuIGFycmF5LiBNYWtlIHRoaXMgcmVkdWNlciBhIGNoaWxkIG9mIGEgcGlwZWxpbmUgcmVkdWNlciB3aXRoIGEgc2VsZWN0b3IuIGh0dHA6Ly9yZWR1eC1jb2xsZWN0b3IubWVkaWFkcmFrZS5jb20vI2dvdGNoYXMnO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb25maWd1cmVDb2xsZWN0aWZ5KG9wdGlvbnMgPSB7fSkge1xuXG4gIHJldHVybiBmdW5jdGlvbiBjb2xsZWN0aWZ5KC4uLmNvbmZpZykge1xuXG4gICAgY29uc3QgW3tcbiAgICAgIGl0ZW1EZWZhdWx0OiBpdGVtRGVmYXVsdEFyZyxcbiAgICAgIGNvbGxlY3Rpb25EZWZhdWx0ID0gW10sXG4gICAgICBhZGQgPSAnQEAvQ09MTEVDVE9SX0FERCcsXG4gICAgICBtb3ZlID0gJ0BAL0NPTExFQ1RPUl9NT1ZFJyxcbiAgICAgIHN3YXAgPSAnQEAvQ09MTEVDVE9SX1NXQVAnLFxuICAgICAgYWRkUmFuZ2UgPSAnQEAvQ09MTEVDVE9SX0FERF9SQU5HRScsXG4gICAgICByZW1vdmUgPSAnQEAvQ09MTEVDVE9SX1JFTU9WRScsXG4gICAgICBoeWRyYXRlID0gJ0BAL0NPTExFQ1RPUl9IWURSQVRFJyxcbiAgICAgIHNvcnQgPSAnQEAvQ09MTEVDVE9SX1NPUlQnXG4gICAgfSA9IHt9LCByZWR1Y2VyQXJnID0gW11dID0gY29uZmlnLnJldmVyc2UoKTtcblxuICAgIGNvbnN0IGl0ZW1EZWZhdWx0ID0gaXRlbURlZmF1bHRBcmcgPT09IHVuZGVmaW5lZFxuICAgICAgPyByZWR1Y2VyQXJnLmRlZmF1bHRzVG9cbiAgICAgIDogaXRlbURlZmF1bHRBcmc7XG5cbiAgICBjb25zdCByZWR1Y2VyID0gcmVkdWNpZnkoXy5pc1BsYWluT2JqZWN0KHJlZHVjZXJBcmcpID8gKGNoZWNrUmVkdWNlckFyZyhyZWR1Y2VyQXJnKSAmJiB7Li4ucmVkdWNlckFyZywgZGVmYXVsdHNUbzogW119KSA6IHJlZHVjZXJBcmcpO1xuXG4gICAgY29uc3QgJCRjb2xsZWN0b3IgPSBjcmVhdGVSZWR1Y2VycyhvcHRpb25zLCB7aXRlbURlZmF1bHQsIHJlZHVjZXJ9KTtcblxuICAgIHJldHVybiBmdW5jdGlvbiByZWR1eENvbGxlY3RvcihzdGF0ZSA9IGNvbGxlY3Rpb25EZWZhdWx0LCBhY3Rpb24gPSB7fSwgLi4ucmVzdCkge1xuICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIGFkZDpcbiAgICAgICAgICByZXR1cm4gJCRjb2xsZWN0b3IuYWRkKHN0YXRlLCBhY3Rpb24sIC4uLnJlc3QpO1xuICAgICAgICBjYXNlIHNvcnQ6XG4gICAgICAgICAgcmV0dXJuICQkY29sbGVjdG9yLnNvcnQoc3RhdGUsIGFjdGlvbiwgLi4ucmVzdCk7XG4gICAgICAgIGNhc2UgYWRkUmFuZ2U6XG4gICAgICAgICAgcmV0dXJuICQkY29sbGVjdG9yLmFkZFJhbmdlKHN0YXRlLCBhY3Rpb24sIC4uLnJlc3QpO1xuICAgICAgICBjYXNlIHJlbW92ZTpcbiAgICAgICAgICByZXR1cm4gJCRjb2xsZWN0b3IuZmlsdGVyKHN0YXRlLCBhY3Rpb24sIC4uLnJlc3QpO1xuICAgICAgICBjYXNlIG1vdmU6XG4gICAgICAgICAgcmV0dXJuICQkY29sbGVjdG9yLm1vdmUoc3RhdGUsIGFjdGlvbiwgLi4ucmVzdCk7XG4gICAgICAgIGNhc2UgaHlkcmF0ZTpcbiAgICAgICAgICByZXR1cm4gJCRjb2xsZWN0b3IuaHlkcmF0ZShzdGF0ZSwgYWN0aW9uLCAuLi5yZXN0KTtcbiAgICAgICAgY2FzZSBzd2FwOlxuICAgICAgICAgIHJldHVybiAkJGNvbGxlY3Rvci5zd2FwKHN0YXRlLCBhY3Rpb24sIC4uLnJlc3QpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiAkJGNvbGxlY3Rvci51cGRhdGUoc3RhdGUsIGFjdGlvbiwgLi4ucmVzdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZ3VyZUNvbGxlY3RpZnkoKTtcbmV4cG9ydCB7Y29uZmlndXJlQ29sbGVjdGlmeSwgY2xhbXB9O1xuIl19