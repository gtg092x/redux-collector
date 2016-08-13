'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clamp = exports.configureCollectify = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
    throw '[Redux Collector] - The top level of this reducer must be an array. Make this reducer a child of a pipeline reducer with a selector. http://redux-collector.mediadrake.com/#gotchas';
  }
  return true;
}

function configureCollectify() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


  return function collectify() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var itemDefaultArg = _ref.itemDefault;
    var _ref$add = _ref.add;
    var add = _ref$add === undefined ? '@@/COLLECTOR_ADD' : _ref$add;
    var _ref$move = _ref.move;
    var move = _ref$move === undefined ? '@@/COLLECTOR_MOVE' : _ref$move;
    var _ref$swap = _ref.swap;
    var swap = _ref$swap === undefined ? '@@/COLLECTOR_SWAP' : _ref$swap;
    var _ref$addRange = _ref.addRange;
    var addRange = _ref$addRange === undefined ? '@@/COLLECTOR_ADD_RANGE' : _ref$addRange;
    var _ref$remove = _ref.remove;
    var remove = _ref$remove === undefined ? '@@/COLLECTOR_REMOVE' : _ref$remove;
    var _ref$hydrate = _ref.hydrate;
    var hydrate = _ref$hydrate === undefined ? '@@/COLLECTOR_HYDRATE' : _ref$hydrate;
    var _ref$sort = _ref.sort;
    var sort = _ref$sort === undefined ? '@@/COLLECTOR_SORT' : _ref$sort;
    var reducerArg = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var collectionDefault = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];


    var itemDefault = itemDefaultArg === undefined ? reducerArg.defaultsTo : itemDefaultArg;

    var reducer = (0, _reducify2.default)(_lodash2.default.isPlainObject(reducerArg) ? checkReducerArg(reducerArg) && _extends({}, reducerArg, { defaultsTo: [] }) : reducerArg);

    var $$collector = (0, _collectorReducers2.default)(options, { itemDefault: itemDefault, reducer: reducer });

    return function reduxCollector() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? collectionDefault : arguments[0];
      var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        rest[_key - 2] = arguments[_key];
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
//# sourceMappingURL=data:application/json;base64,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O1FBQ1AsbUIsR0FBQSxtQjtRQUFxQixLIiwiZmlsZSI6ImNvbGxlY3RpZnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlUmVkdWNlcnMgZnJvbSAnLi9jb2xsZWN0b3ItcmVkdWNlcnMnO1xuaW1wb3J0IHtjbGFtcH0gZnJvbSAnLi9saWInO1xuaW1wb3J0IHJlZHVjaWZ5IGZyb20gJ3JlZHVjaWZ5JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmZ1bmN0aW9uIGNoZWNrUmVkdWNlckFyZyhhcmcpIHtcbiAgaWYgKGFyZy4kIHx8IGFyZy5zZWxlY3QpIHtcbiAgICB0aHJvdyAnW1JlZHV4IENvbGxlY3Rvcl0gLSBUaGUgdG9wIGxldmVsIG9mIHRoaXMgcmVkdWNlciBtdXN0IGJlIGFuIGFycmF5LiBNYWtlIHRoaXMgcmVkdWNlciBhIGNoaWxkIG9mIGEgcGlwZWxpbmUgcmVkdWNlciB3aXRoIGEgc2VsZWN0b3IuIGh0dHA6Ly9yZWR1eC1jb2xsZWN0b3IubWVkaWFkcmFrZS5jb20vI2dvdGNoYXMnO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb25maWd1cmVDb2xsZWN0aWZ5KG9wdGlvbnMgPSB7fSkge1xuXG4gIHJldHVybiBmdW5jdGlvbiBjb2xsZWN0aWZ5KHtcbiAgICBpdGVtRGVmYXVsdDogaXRlbURlZmF1bHRBcmcsXG4gICAgYWRkID0gJ0BAL0NPTExFQ1RPUl9BREQnLFxuICAgIG1vdmUgPSAnQEAvQ09MTEVDVE9SX01PVkUnLFxuICAgIHN3YXAgPSAnQEAvQ09MTEVDVE9SX1NXQVAnLFxuICAgIGFkZFJhbmdlID0gJ0BAL0NPTExFQ1RPUl9BRERfUkFOR0UnLFxuICAgIHJlbW92ZSA9ICdAQC9DT0xMRUNUT1JfUkVNT1ZFJyxcbiAgICBoeWRyYXRlID0gJ0BAL0NPTExFQ1RPUl9IWURSQVRFJyxcbiAgICBzb3J0ID0gJ0BAL0NPTExFQ1RPUl9TT1JUJ1xuICB9ID0ge30sIHJlZHVjZXJBcmcgPSBbXSwgY29sbGVjdGlvbkRlZmF1bHQgPSBbXSkge1xuXG5cblxuICAgIGNvbnN0IGl0ZW1EZWZhdWx0ID0gaXRlbURlZmF1bHRBcmcgPT09IHVuZGVmaW5lZFxuICAgICAgPyByZWR1Y2VyQXJnLmRlZmF1bHRzVG9cbiAgICAgIDogaXRlbURlZmF1bHRBcmc7XG5cbiAgICBjb25zdCByZWR1Y2VyID0gcmVkdWNpZnkoXy5pc1BsYWluT2JqZWN0KHJlZHVjZXJBcmcpID8gKGNoZWNrUmVkdWNlckFyZyhyZWR1Y2VyQXJnKSAmJiB7Li4ucmVkdWNlckFyZywgZGVmYXVsdHNUbzogW119KSA6IHJlZHVjZXJBcmcpO1xuXG4gICAgY29uc3QgJCRjb2xsZWN0b3IgPSBjcmVhdGVSZWR1Y2VycyhvcHRpb25zLCB7aXRlbURlZmF1bHQsIHJlZHVjZXJ9KTtcblxuICAgIHJldHVybiBmdW5jdGlvbiByZWR1eENvbGxlY3RvcihzdGF0ZSA9IGNvbGxlY3Rpb25EZWZhdWx0LCBhY3Rpb24gPSB7fSwgLi4ucmVzdCkge1xuICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIGFkZDpcbiAgICAgICAgICByZXR1cm4gJCRjb2xsZWN0b3IuYWRkKHN0YXRlLCBhY3Rpb24sIC4uLnJlc3QpO1xuICAgICAgICBjYXNlIHNvcnQ6XG4gICAgICAgICAgcmV0dXJuICQkY29sbGVjdG9yLnNvcnQoc3RhdGUsIGFjdGlvbiwgLi4ucmVzdCk7XG4gICAgICAgIGNhc2UgYWRkUmFuZ2U6XG4gICAgICAgICAgcmV0dXJuICQkY29sbGVjdG9yLmFkZFJhbmdlKHN0YXRlLCBhY3Rpb24sIC4uLnJlc3QpO1xuICAgICAgICBjYXNlIHJlbW92ZTpcbiAgICAgICAgICByZXR1cm4gJCRjb2xsZWN0b3IuZmlsdGVyKHN0YXRlLCBhY3Rpb24sIC4uLnJlc3QpO1xuICAgICAgICBjYXNlIG1vdmU6XG4gICAgICAgICAgcmV0dXJuICQkY29sbGVjdG9yLm1vdmUoc3RhdGUsIGFjdGlvbiwgLi4ucmVzdCk7XG4gICAgICAgIGNhc2UgaHlkcmF0ZTpcbiAgICAgICAgICByZXR1cm4gJCRjb2xsZWN0b3IuaHlkcmF0ZShzdGF0ZSwgYWN0aW9uLCAuLi5yZXN0KTtcbiAgICAgICAgY2FzZSBzd2FwOlxuICAgICAgICAgIHJldHVybiAkJGNvbGxlY3Rvci5zd2FwKHN0YXRlLCBhY3Rpb24sIC4uLnJlc3QpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiAkJGNvbGxlY3Rvci51cGRhdGUoc3RhdGUsIGFjdGlvbiwgLi4ucmVzdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZ3VyZUNvbGxlY3RpZnkoKTtcbmV4cG9ydCB7Y29uZmlndXJlQ29sbGVjdGlmeSwgY2xhbXB9O1xuIl19