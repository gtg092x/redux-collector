import _ from 'lodash';

import {defaultMatcher} from './default-resolver';

function generateIndexesOf(matcher) {
  return (collection, query, {skip = 0, limit = collection.length}) => {
    const indexes = [];
    for (let i = skip; i < limit && i < collection.length; i ++) {
      if (matcher(collection[i], query)) {
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

function clamp(range, index) {
  return (range + index % range) % range;
}

function generateCollector({matcher = defaultMatcher, indexOf: indexOfArg, indexesOf: indexesOfArg, sortBy: sortByArg} = {}) {

  const indexesOf = indexesOfArg || generateIndexesOf(matcher);

  const indexOf = indexOfArg || generateIndexof(indexesOf);

  const sortBy = sortByArg || _.sortBy;

  const sort = (collection = [], action = {}) => {
    const {data: sorter = (action.orderBy)} = action;
    const newCollection = collection.map(item => {
      const newItem = _.clone(item);
      return newItem;
    });
    return sortBy(newCollection, sorter);
  };

  const sortIfArg = (collection, action) => {
    const {data: sorter = (action.orderBy)} = action;
    if (sort !== undefined) {
      const newCollection = collection.map(item => {
        const newItem = _.clone(item);
        return newItem;
      });
      return sortBy(newCollection, sorter);
    }
    return collection;
  };

  const normalizeAction = (collection, action) => {
    const {skip, limit = collection.length, index, after, range, ...rest} = action;

    let toSkip = skip;
    let toLimit = limit;

    if (index !== undefined) {
      toLimit = 1;
      toSkip = clamp(collection.length, toSkip);
    } else if (range !== undefined) {
      const [start, end] = range.map(clamp.bind(undefined, collection.length));
      toLimit = end - start;
      toSkip = start;
    } else if (after !== undefined) {
      toSkip = indexOf(collection, after, skip);
    }
    return {skip: toSkip, limit: toLimit, ...rest};
  };

  const getSwapIndexes = (collection, action) => {
    const {indexes, ranges, queries} = action;
    const {skip = 0, limit = collection.length} = normalizeAction(collection, action);
    const result = [];

    if (indexes !== undefined) {
      result.push(...indexes);
    }

    if (ranges !== undefined) {
      const rangeResult = [];
      ranges.forEach(range => {
        const [start, end] = range.map(clamp.bind(undefined, collection.length));
        for (let i = start; i < end; i ++) {
          rangeResult.push(i);
        }
      });
      result.push(...rangeResult);
    }

    if (queries !== undefined) {
      const queryResult = [];
      queries.forEach(query => {
        queryResult.push(indexesOf(collection, query));
      });
      result.push(...queryResult);
    }

    return _.unique(result).slice(skip, limit - skip);
  };

  const resultTransform = (result, action) => {
    return sortIfArg(result, action);
  };

  return {
    add(collection = [], action = {}) {
      const {skip = collection.length, add} = normalizeAction(collection, action);

      return sortIfArg([...collection.slice(0, skip), add, ...collection.slice(skip)], action);
    },
    addRange(collection = [], action = {}) {
      const {skip = collection.length, add} = normalizeAction(collection, action);

      return resultTransform([...collection.slice(0, skip), ...add, ...collection.slice(skip)], action);
    },
    move(collection = [], action = {}) {
      // TODO
      const indexes = getSwapIndexes(collection, action);

      let arr = [...collection];

      for(let i = 0; i < indexes.length - 1; i++) {
        const index1 = indexes.slice(i + 1)[0];
        const index2 = indexes[i];
        const temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
      }

      return resultTransform(arr, action);
    },
    swap(collection = [], action = {}) {
      const indexes = getSwapIndexes(collection, action);

      let arr = [...collection];

      for(let i = 0; i < indexes.length - 1; i++) {
        const index1 = indexes.slice(i + 1)[0];
        const index2 = indexes[i];
        const temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
      }

      return resultTransform(arr, action);
    },
    update(collection = [], action = {}, reducer = _.identity) {

      const {limit, skip = 0, query} = normalizeAction(collection, action);

      const result = [];

      for (let i = 0; i < collection.length; i++) {
        if (i >= skip && result.length < limit && matcher(collection[i], query)) {
          const {action: subType, ...rest} = action;
          result.push(reducer(collection[i], {...rest, type: subType}));
        } else {
          result.push(collection[i]);
        }
      }

      return resultTransform(result, action);
    },
    filter(collection = [], action = {}) {
      const {limit, skip = 0, query} = normalizeAction(collection, action);

      const result = [];
      for (let i = 0; i < collection.length; i++) {
        if (i < skip || result.length >= limit || !matcher(collection[i], query)) {
          result.push(collection[i]);
        }
      }
      return resultTransform(result, action);
    },
    sort
  };

}

export {generateCollector};
