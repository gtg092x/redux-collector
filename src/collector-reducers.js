import _ from 'lodash';
import {contains, matcherWrap, mapIndexes, resultTransform, sortResultTransform, addWrapper, sortTransform} from './lib';

import {defaultMatcher} from './default-resolver';
import {generateIndexesOf, generateIndexof} from './method-generators';

import {normalizeSortArgs, normalizeAction as normalizeActionBase} from './normalizers';
import {getIndexesBase, getMoveIndexesBase} from './match-methods';
import collectorReducerBase from './collector-reducer-base';
import {sortReducers} from './config';

function checkState (state) {
  if (!_.isArray(state)) {
    throw `[Redux Collector] - State ${JSON.stringify(state)} is not an array. All collector reducers must be passed an array.`;
  }
}

function generateCollector({matcher: matcherArg, indexOf: indexOfArg, indexesOf: indexesOfArg, sortBy: sortByArg} = {}, {reducer: itemReducer = _.identity, itemDefault} = {}) {

  const matcherConfig = matcherArg === undefined ? defaultMatcher : _.partialRight(matcherArg, defaultMatcher);

  // Matcher Methods
  const matcher = _.wrap(matcherConfig, matcherWrap);
  const indexesOf = indexesOfArg || generateIndexesOf(matcher);
  const indexOf = indexOfArg || generateIndexof(indexesOf);
  const sortBy = sortByArg || _.orderBy;
  const normalizeAction = normalizeActionBase.bind(this, indexOf);


  // Argument Transforms
  function sortIfArg (state, action) {
    const {sort, orders} = normalizeSortArgs(action);
    if (sort !== undefined || orders !== undefined) {
      const result = sortBy(state,
        sortTransform(sort, orders),
        orders);
      return result;
    }
    return state;
  }

  function argTransform (result, action) {
    return _(result)
      .thru(_.partialRight(mapIndexes, action))
      .thru(_.partialRight(sortIfArg, action))
      .value();
  }

  // Reducer Transforms
  function collectionReducerWrap (reducer, state, actionArgs, ...args) {
    checkState(state);
    const stateArg = argTransform(state, actionArgs);
    const action = normalizeAction(stateArg, actionArgs);
    const result = reducer.call(this, stateArg, action, ...args);
    return resultTransform(result, action);
  }

  function sortReducerWrap (reducer, state, action, ...args) {
    checkState(state);
    const stateArg = argTransform(state, action);
    const result = reducer.call(this, stateArg, action, ...args);
    return sortResultTransform(result, action);
  }

  function itemReducerWrap(fn, {item, index}, ...args) {
    const result = fn(item, ...args);
    return {item: result, index};
  }



  // Matcher methods
  const getIndexes = getIndexesBase.bind(this, indexesOf);
  const getMoveIndexes = getMoveIndexesBase.bind(this, indexesOf);


  const collectorObject = collectorReducerBase({
    itemDefault,
    matcher,
    getIndexes,
    getMoveIndexes,
    addWrapper,
    reducer: _.wrap(itemReducer, itemReducerWrap),
    sortBy
  });

  return Object.keys(collectorObject).reduce((pointer, key) => {

    if (contains(sortReducers, key)) {
      return {
        ...pointer,
        [key]: _.wrap(collectorObject[key], sortReducerWrap)
      };
    }

    return {
      ...pointer,
      [key]: _.wrap(collectorObject[key], collectionReducerWrap)
    };
  }, {});

}

export default generateCollector;
