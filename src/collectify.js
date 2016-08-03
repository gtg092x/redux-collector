import generateCollector from './generateCollector';
import {clamp} from './lib';
import reducify from 'reducify';

function configureCollectify(options = {}) {

  return function collectify(reducerArg,
    {
      add = '@@/$COLLECTOR_ADD',
      move = '@@/$COLLECTOR_MOVE',
      swap = '@@/$COLLECTOR_SWAP',
      addRange = '@@/$COLLECTOR_ADD_RANGE',
      remove = '@@/$COLLECTOR_REMOVE',
      update = '@@/$COLLECTOR_UPDATE',
      sort = '@@/$COLLECTOR_SORT'
    }) {

    const reducer = reducify(reducerArg);

    const $$collector = generateCollector(options);

    return function reduxCollector(state = [], action = {}) {

      switch (action.type) {
        case add:
          return $$collector.add(state, action);
        case sort:
          return $$collector.sort(state, action);
        case addRange:
          return $$collector.addRange(state, action);
        case remove:
          return $$collector.filter(state, action);
        case move:
          return $$collector.move(state, action);
        case swap:
          return $$collector.swap(state, action);
        case update:
          return $$collector.update(state, action, reducer);
        default:
          return state;
      }
    }
  }
}

export default configureCollectify();
export {configureCollectify, clamp};
