import _ from 'lodash';

function generateIndexesOf(matcher) {
  return function generatedIndexesOf (state, query, {skip = 0, limit = state.length} = {}) {
    const indexes = [];
    for (let i = skip; indexes.length < limit && i < state.length; i ++) {
      if (matcher(state[i], query, i)) {
        indexes.push(i);
      }
    }
    return indexes;
  };
}

function generateIndexof(indexesOf) {
  return function generatedIndexOf (arr, query, skip = 0) {
    const indexes = indexesOf(arr, query, {skip, limit: 1});
    const index = _.first(indexes);
    return index === undefined ? -1 : index;
  };
}

export {generateIndexesOf, generateIndexof};
