import {contains, sortTransform} from './lib';
import {normalizeSortArgs} from './normalizers';
import _ from 'lodash';

function incrementIndex({index, item}) {
  return {
    item,
    index: index + 1
  };
}

function collectorReducerBase({itemDefault, matcher, addWrapper, getMoveIndexes, reducer, getIndexes, sortBy}) {
  return {
    add(state = [], {skip = state.length, add: addArg, data} = {}) {

      const add = addArg === undefined
        ? data
        : addArg;

      return [...state.slice(0, skip), addWrapper(add === undefined ? itemDefault : add, skip + 1), ...state.slice(skip).map(incrementIndex)];
    },
    addRange(state = [], {skip = state.length, add: addArg, data} = {}) {

      let add = addArg === undefined
        ? data
        : addArg;

      if (!_.isArray(add)) {
        add = [add];
      }
      return [
        ...state.slice(0, skip),
        ...add.map(item => item === undefined ? itemDefault : item).map((item, i) => addWrapper(item, skip + i)),
        ...state.slice(skip).map(incrementIndex)
      ];
    },
    move(state = [], action = {}) {
      const {to, from} = getMoveIndexes(state, action);

      let arr = [...state];
      const toInject = [];

      for(let i = from.length - 1; i >= 0; i--) {
        const fromIndex = from[i];
        toInject.push({item: arr.splice(fromIndex, 1).pop(), index: fromIndex});
      }
      toInject.reverse();


      let stateIndex = state.map((item, index) => ({item, index}));

      const noFromIndexes = ({item, index}) => !contains(toInject.map(({index}) => index), index);

      arr = [
        ...stateIndex.slice(0, to).filter(noFromIndexes).map(({item}) => item),
        ...toInject.map(({item}) => item),
        ...stateIndex.slice(to).filter(noFromIndexes).map(({item}) => item)
      ];
      return arr;
    },
    swap(state = [], action = {}) {
      const indexes = getIndexes(state, action);
      let arr = [...state];

      for(let i = indexes.length - 1; i >= 1; i--) {
        const index1 = indexes[i];
        const index2 = indexes.slice(i - 1)[0];
        const temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
      }

      return arr;
    },
    update(state = [], {limit, skip = 0, query, ...rest} = {}) {

      const result = [];
      for (let i = 0, updated = 0; i < state.length; i++) {
        if (i >= skip && updated < limit && matcher(state[i], query)) {
          result.push(reducer(state[i], rest));
          updated ++;
        } else {
          result.push(state[i]);
        }
      }
      return result;
    },
    filter(state = [], {limit, skip = 0, query} = {}) {

      const result = [];
      for (let i = 0, removed = 0; i < state.length; i++) {
        if (i < skip || removed >= limit || (query !== undefined && !matcher(state[i], query))) {
          result.push(state[i]);
        } else {
          removed ++;
        }
      }
      return result;
    },
    sort(state = [], actionArg = {}) {
      let {data, sort: sortArgRaw, ...rest} = actionArg;
      const sorter = data === undefined
        ? sortArgRaw
        : data;

      const {sort: sortArg, orders} = normalizeSortArgs({sort: sorter, ...rest});
      return sortBy(state, sortTransform(sortArg, orders), orders);
    }
  };
}

export default collectorReducerBase;
