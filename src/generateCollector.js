import _ from 'lodash';
import {clamp} from './lib';

import {defaultMatcher} from './default-resolver';

function generateIndexesOf(matcher) {
  return (state, query, {skip = 0, limit = state.length}) => {
    const indexes = [];
    for (let i = skip; i < limit && i < state.length; i ++) {
      if (matcher(state[i], query)) {
        indexes.push(i);
      }
    }
    return indexes;
  };
}

function generateIndexof(indexesOf) {
  return (arr, query, skip = 0) => {
    return _.first(indexesOf(arr, query, {skip, limit: 1}));
  };
}


function generateCollector({matcher = defaultMatcher, indexOf: indexOfArg, indexesOf: indexesOfArg, sortBy: sortByArg} = {}) {

  const indexesOf = indexesOfArg || generateIndexesOf(matcher);

  const indexOf = indexOfArg || generateIndexof(indexesOf);

  const sortBy = sortByArg || _.sortBy;

  const sortFn = (state = [], action = {}) => {
    const {data: sorter = (action.orderBy)} = action;
    const newstate = state.map(item => {
      const newItem = _.clone(item);
      return newItem;
    });
    return sortBy(newstate, sorter);
  };

  const sortIfArg = (state, action) => {
    const {sort = (action.orderBy)} = action;
    if (sort !== undefined) {
      const newstate = state.map(item => {
        const newItem = _.clone(item);
        return newItem;
      });
      return sortBy(newstate, sort);
    }
    return state;
  };

  const normalizeAction = (state, action) => {
    const {skip, limit = state.length, index, after, range, ...rest} = action;
    let toSkip = skip;
    let toLimit = limit;

    if (index !== undefined) {
      toLimit = 1;
      toSkip = clamp(state.length, index);
    } else if (range !== undefined) {
      const [start, end] = range.map(clamp.bind(undefined, state.length));
      toLimit = end - start;
      toSkip = start;
    } else if (after !== undefined) {
      toSkip = indexOf(state, after, skip);
    }
    return {skip: toSkip, limit: toLimit, ...rest};
  };

  const getIndexes = (state, action) => {
    const {indexes, ranges, queries} = action;
    const {skip = 0, limit = state.length} = normalizeAction(state, action);
    const result = [];

    if (indexes !== undefined) {
      result.push(...indexes);
    }

    if (ranges !== undefined) {
      const rangeResult = [];
      ranges.forEach(range => {
        const [start, end] = range.map(clamp.bind(undefined, state.length));
        for (let i = start; i < end; i ++) {
          rangeResult.push(i);
        }
      });
      result.push(...rangeResult);
    }

    if (queries !== undefined) {
      const queryResult = [];
      queries.forEach(query => {
        queryResult.push(indexesOf(state, query));
      });
      result.push(...queryResult);
    }

    return _.sortBy(_.unique(result).slice(skip, limit - skip));
  };

  const getSwapIndexes = (state, action) => {
    return getIndexes(state, action);
  };

  const resultTransform = _.identity;

  const argTransform = (result, action) => {
    return sortIfArg(result, action);
  };

  const getMoveIndexes = (state, action) => {
    const from = getIndexes(state, action.from);
    const to = _.first(getIndexes(state, action.to));
    return {from, to};
  };

  return {
    add(stateArg = [], action = {}) {
      const state = argTransform(stateArg, action);
      const {skip = state.length, add: addArg} = normalizeAction(state, action);
      const add = addArg === undefined
        ? action.data
        : addArg;
      return resultTransform([...state.slice(0, skip), add, ...state.slice(skip)], action);
    },
    addRange(stateArg = [], action = {}) {
      const state = argTransform(stateArg, action);

      const {skip = state.length, add: addArg} = normalizeAction(state, action);

      const add = addArg === undefined
        ? action.data
        : addArg;

      return resultTransform([...state.slice(0, skip), ...add, ...state.slice(skip)], action);
    },
    move(stateArg = [], action = {}) {
      const state = argTransform(stateArg, action);
      const {to, from} = getMoveIndexes(state, action);

      let arr = [...state];
      const toInject = [];

      for(let i = from.length - 1; i >= 0; i--) {
        const fromIndex = from[i];
        toInject.push({item: arr.splice(fromIndex, 1), index: i});
      }
      // figure this out
      let stateIndex = state.map((item, index) => ({item, index}));

      const noFromIndexes = ({item, index}) => !_.contains(fromIndex, index);

      arr = [
        stateIndex.slice(0, to).filter(noFromIndexes).map(({item}) => item),
        ...toInject.map(({item}) => item),
        stateIndex.slice(to).filter(noFromIndexes).map(({item}) => item)
      ];

      return resultTransform(arr, action);
    },
    swap(stateArg = [], action = {}) {
      const state = argTransform(stateArg, action);
      const indexes = getSwapIndexes(state, action);

      let arr = [...state];

      for(let i = 0; i < indexes.length - 1; i++) {
        const index1 = indexes.slice(i + 1)[0];
        const index2 = indexes[i];
        const temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
      }

      return resultTransform(arr, action);
    },
    update(stateArg = [], action = {}, reducer = _.identity) {
      const state = argTransform(stateArg, action);
      const {limit, skip = 0, query, action: subAction = action.data, ...rest} = normalizeAction(state, action);
      const result = [];

      for (let i = 0; i < state.length; i++) {
        if (i >= skip && result.length < limit && matcher(state[i], query)) {
          result.push(reducer(state[i], {...rest, ...subAction}));
        } else {
          result.push(state[i]);
        }
      }
      return resultTransform(result, action);
    },
    filter(stateArg = [], action = {}) {
      const state = argTransform(stateArg, action);
      const {limit, skip = 0, query} = normalizeAction(state, action);
      const result = [];
      for (let i = 0, removed = 0; i < state.length; i++) {
        if (i < skip || removed >= limit || (query !== undefined && !matcher(state[i], query))) {
          result.push(state[i]);
        } else {
          removed ++;
        }
      }
      return resultTransform(result, action);
    },
    sort: sortFn
  };

}

export default generateCollector;
