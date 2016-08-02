import { collectify } from '../../../../src/redux-collector';

function simpleReducer(state = 0, action) {
  switch (action.type) {
    case 'RANDOMIZE':
      return {num: Math.floor(Math.random() * 100)};
    default:
      return state;
  }
}

function baseReducer(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default collectify(baseReducer, simpleReducer, {
    add: 'ADD_SIMPLE',
    addRange: 'ADD_RANGE_SIMPLE',
    remove: 'REMOVE_SIMPLE',
    update: 'UPDATE_SIMPLE',
    sort: 'SORT_SIMPLE'
  },
  (state = {}) => state.randomNumbers,
  (collection, state) => ({...state, randomNumbers: collection})
);
