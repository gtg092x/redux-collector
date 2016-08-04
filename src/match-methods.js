import _ from 'lodash';

import {clamp} from './lib';
import {normalizeIndexArgs, normalizeFrom, normalizeTo} from './normalizers';

function getIndexesBase(indexesOf, state, action = {}) {
  const {indexes, ranges, queries} = normalizeIndexArgs(action);
  const result = [];

  if (indexes !== undefined) {
    result.push(...indexes);
  }
  if (ranges !== undefined) {
    ranges.forEach(range => {
      const [start, end] = range.map(clamp.bind(undefined, state.length));
      for (let i = start; i <= end; i ++) {
        result.push(i);
      }
    });
  }
  if (queries !== undefined) {
    queries.forEach(query => {
      result.push(...indexesOf(state, query));
    });
  }
  return _.uniq(result);
}

function getMoveIndexesBase (indexesOf, state, action) {
  const getIndexes = getIndexesBase.bind(this, indexesOf);
  const fromArg = normalizeFrom(action.from);

  const from = getIndexes(state, fromArg);

  const toArg = normalizeTo(action.to);

  const to = _.first(getIndexes(state, toArg));
  return {from, to};
}

export {getIndexesBase, getMoveIndexesBase};
