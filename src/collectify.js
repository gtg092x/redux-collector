import _ from 'lodash';

function defaultMapStateToCollection(state = []) {
  return state;
}

function collectifyFn(baseReducer, reducer, {add, addRange = '@@/$COLLECTOR_ADD_RANGE', remove, update, sort = '@@/$COLLECTOR_SORT'}, mapStateToCollection = defaultMapStateToCollection, mergeCollectionWithState = _.identity) {
  
  
  
  return function(state, actionArg = {}) {
    const collection = mapStateToCollection(state) || [];
    const {$$collector, ...action} = actionArg;
    let result = collection;
    switch (action.type) {
      case add:
        result = $$collector.add(collection, action);
        break;
      case sort:
        result = $$collector.sort(collection, action);
        break;
      case addRange:
        result = $$collector.addRange(collection, action);
        break;
      case remove:
        result = $$collector.filter(collection, action);
        break;
      case update:
        result = $$collector.update(collection, action, reducer);
        break;
      default:
        break;
    }
    return baseReducer(mergeCollectionWithState(result, state), action);
  }
}

function collectify(...args) {
  if (_.isFunction(args[1])) {
    return collectifyFn(...args);
  } else {
    return collectifyFn(_.identity, ...args);
  }
}

export {collectify};
