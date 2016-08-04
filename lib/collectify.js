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
    throw '[Redux Collector] - The top level of this reducer must be an array. Make this reducer a child of a pipeline reducer with a selector. http://redux-collector.mediadrake.com/#gotchas';
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
//# sourceMappingURL=data:application/json;base64,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WSxNQUFaLHFCQUFtQixLQUFuQixFQUEwQixNQUExQixTQUFxQyxJQUFyQyxFQUFQO0FBaEJKO0FBa0JELEtBbkJEO0FBb0JELEdBMUNEO0FBMkNEOztrQkFFYyxxQjtRQUNQLG1CLEdBQUEsbUI7UUFBcUIsSyIsImZpbGUiOiJjb2xsZWN0aWZ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZVJlZHVjZXJzIGZyb20gJy4vY29sbGVjdG9yLXJlZHVjZXJzJztcbmltcG9ydCB7Y2xhbXB9IGZyb20gJy4vbGliJztcbmltcG9ydCByZWR1Y2lmeSBmcm9tICdyZWR1Y2lmeSc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5mdW5jdGlvbiBjaGVja1JlZHVjZXJBcmcoYXJnKSB7XG4gIGlmIChhcmcuJCB8fCBhcmcuc2VsZWN0KSB7XG4gICAgdGhyb3cgJ1tSZWR1eCBDb2xsZWN0b3JdIC0gVGhlIHRvcCBsZXZlbCBvZiB0aGlzIHJlZHVjZXIgbXVzdCBiZSBhbiBhcnJheS4gTWFrZSB0aGlzIHJlZHVjZXIgYSBjaGlsZCBvZiBhIHBpcGVsaW5lIHJlZHVjZXIgd2l0aCBhIHNlbGVjdG9yLiBodHRwOi8vcmVkdXgtY29sbGVjdG9yLm1lZGlhZHJha2UuY29tLyNnb3RjaGFzJztcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29uZmlndXJlQ29sbGVjdGlmeShvcHRpb25zID0ge30pIHtcblxuICByZXR1cm4gZnVuY3Rpb24gY29sbGVjdGlmeSguLi5jb25maWcpIHtcblxuICAgIGNvbnN0IFt7XG4gICAgICBpdGVtRGVmYXVsdDogaXRlbURlZmF1bHRBcmcsXG4gICAgICBjb2xsZWN0aW9uRGVmYXVsdCA9IFtdLFxuICAgICAgYWRkID0gJ0BAL0NPTExFQ1RPUl9BREQnLFxuICAgICAgbW92ZSA9ICdAQC9DT0xMRUNUT1JfTU9WRScsXG4gICAgICBzd2FwID0gJ0BAL0NPTExFQ1RPUl9TV0FQJyxcbiAgICAgIGFkZFJhbmdlID0gJ0BAL0NPTExFQ1RPUl9BRERfUkFOR0UnLFxuICAgICAgcmVtb3ZlID0gJ0BAL0NPTExFQ1RPUl9SRU1PVkUnLFxuICAgICAgaHlkcmF0ZSA9ICdAQC9DT0xMRUNUT1JfSFlEUkFURScsXG4gICAgICBzb3J0ID0gJ0BAL0NPTExFQ1RPUl9TT1JUJ1xuICAgIH0gPSB7fSwgcmVkdWNlckFyZyA9IFtdXSA9IGNvbmZpZy5yZXZlcnNlKCk7XG5cbiAgICBjb25zdCBpdGVtRGVmYXVsdCA9IGl0ZW1EZWZhdWx0QXJnID09PSB1bmRlZmluZWRcbiAgICAgID8gcmVkdWNlckFyZy5kZWZhdWx0c1RvXG4gICAgICA6IGl0ZW1EZWZhdWx0QXJnO1xuXG4gICAgY29uc3QgcmVkdWNlciA9IHJlZHVjaWZ5KF8uaXNQbGFpbk9iamVjdChyZWR1Y2VyQXJnKSA/IChjaGVja1JlZHVjZXJBcmcocmVkdWNlckFyZykgJiYgey4uLnJlZHVjZXJBcmcsIGRlZmF1bHRzVG86IFtdfSkgOiByZWR1Y2VyQXJnKTtcblxuICAgIGNvbnN0ICQkY29sbGVjdG9yID0gY3JlYXRlUmVkdWNlcnMob3B0aW9ucywge2l0ZW1EZWZhdWx0LCByZWR1Y2VyfSk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gcmVkdXhDb2xsZWN0b3Ioc3RhdGUgPSBjb2xsZWN0aW9uRGVmYXVsdCwgYWN0aW9uID0ge30sIC4uLnJlc3QpIHtcbiAgICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBhZGQ6XG4gICAgICAgICAgcmV0dXJuICQkY29sbGVjdG9yLmFkZChzdGF0ZSwgYWN0aW9uLCAuLi5yZXN0KTtcbiAgICAgICAgY2FzZSBzb3J0OlxuICAgICAgICAgIHJldHVybiAkJGNvbGxlY3Rvci5zb3J0KHN0YXRlLCBhY3Rpb24sIC4uLnJlc3QpO1xuICAgICAgICBjYXNlIGFkZFJhbmdlOlxuICAgICAgICAgIHJldHVybiAkJGNvbGxlY3Rvci5hZGRSYW5nZShzdGF0ZSwgYWN0aW9uLCAuLi5yZXN0KTtcbiAgICAgICAgY2FzZSByZW1vdmU6XG4gICAgICAgICAgcmV0dXJuICQkY29sbGVjdG9yLmZpbHRlcihzdGF0ZSwgYWN0aW9uLCAuLi5yZXN0KTtcbiAgICAgICAgY2FzZSBtb3ZlOlxuICAgICAgICAgIHJldHVybiAkJGNvbGxlY3Rvci5tb3ZlKHN0YXRlLCBhY3Rpb24sIC4uLnJlc3QpO1xuICAgICAgICBjYXNlIGh5ZHJhdGU6XG4gICAgICAgICAgcmV0dXJuICQkY29sbGVjdG9yLmh5ZHJhdGUoc3RhdGUsIGFjdGlvbiwgLi4ucmVzdCk7XG4gICAgICAgIGNhc2Ugc3dhcDpcbiAgICAgICAgICByZXR1cm4gJCRjb2xsZWN0b3Iuc3dhcChzdGF0ZSwgYWN0aW9uLCAuLi5yZXN0KTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gJCRjb2xsZWN0b3IudXBkYXRlKHN0YXRlLCBhY3Rpb24sIC4uLnJlc3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25maWd1cmVDb2xsZWN0aWZ5KCk7XG5leHBvcnQge2NvbmZpZ3VyZUNvbGxlY3RpZnksIGNsYW1wfTtcbiJdfQ==