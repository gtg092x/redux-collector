import { collectify } from '../../../../src/redux-collector';

function simpleReducer(state = 0, action) {
  switch (action.type) {
    case 'RANDOMIZE':
      return {num: Math.floor(Math.random() * 100)};
    default:
      return state;
  }
}

export default collectify(simpleReducer, {
  add: 'ADD_SIMPLE',
  addRange: 'ADD_RANGE_SIMPLE',
  remove: 'REMOVE_SIMPLE',
  update: 'UPDATE_SIMPLE',
  sort: 'SORT_SIMPLE'
});
