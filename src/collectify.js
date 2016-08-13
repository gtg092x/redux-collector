import createReducers from './collector-reducers';
import {clamp} from './lib';
import reducify from 'reducify';
import _ from 'lodash';

function checkReducerArg(arg) {
  if (arg.$ || arg.select) {
    throw '[Redux Collector] - The top level of this reducer must be an array. Make this reducer a child of a pipeline reducer with a selector. http://redux-collector.mediadrake.com/#gotchas';
  }
  return true;
}

function configureCollectify(options = {}) {

  return function collectify({
    itemDefault: itemDefaultArg,
    add = '@@/COLLECTOR_ADD',
    move = '@@/COLLECTOR_MOVE',
    swap = '@@/COLLECTOR_SWAP',
    addRange = '@@/COLLECTOR_ADD_RANGE',
    remove = '@@/COLLECTOR_REMOVE',
    hydrate = '@@/COLLECTOR_HYDRATE',
    sort = '@@/COLLECTOR_SORT'
  } = {}, reducerArg = [], collectionDefault = []) {



    const itemDefault = itemDefaultArg === undefined
      ? reducerArg.defaultsTo
      : itemDefaultArg;

    const reducer = reducify(_.isPlainObject(reducerArg) ? (checkReducerArg(reducerArg) && {...reducerArg, defaultsTo: []}) : reducerArg);

    const $$collector = createReducers(options, {itemDefault, reducer});

    return function reduxCollector(state = collectionDefault, action = {}, ...rest) {
      switch (action.type) {
        case add:
          return $$collector.add(state, action, ...rest);
        case sort:
          return $$collector.sort(state, action, ...rest);
        case addRange:
          return $$collector.addRange(state, action, ...rest);
        case remove:
          return $$collector.filter(state, action, ...rest);
        case move:
          return $$collector.move(state, action, ...rest);
        case hydrate:
          return $$collector.hydrate(state, action, ...rest);
        case swap:
          return $$collector.swap(state, action, ...rest);
        default:
          return $$collector.update(state, action, ...rest);
      }
    }
  }
}

export default configureCollectify();
export {configureCollectify, clamp};
