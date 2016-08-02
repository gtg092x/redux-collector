import { collectify } from '../../../../src/redux-collector';

function itemReducer(state = 0, action) {
  switch (action.type) {
    case 'RANDOMIZE':
      return {num: Math.floor(Math.random() * 100)};
    default:
      return state;
  }
}

const itemCollectified = collectify(itemReducer, {
  add: 'ADD_SIMPLE',
  addRange: 'ADD_RANGE_SIMPLE',
  remove: 'REMOVE_SIMPLE',
  update: 'UPDATE_SIMPLE',
  sort: 'SORT_SIMPLE'
});

function collectionReducer(state = {food: 'sandwiches'}, action) {
  switch (action.type) {
    default:
      return {...state, numberArray: itemCollectified(state.numberArray, action)};
  }
}

export default collectionReducer;
