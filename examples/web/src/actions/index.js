function add(dispatch) {
  dispatch({
    type: 'ADD_SIMPLE',
    add: {num: 0}
  });
}

function update(dispatch) {
  dispatch({
    type: 'UPDATE_SIMPLE',
    action: 'RANDOMIZE',
    query: {num: 0}
  });
}

function remove(dispatch) {
  dispatch({
    type: 'REMOVE_SIMPLE',
    query: function (state) {
      return state.num > 50;
    }
  });
}

function removeAll(dispatch) {
  dispatch({
    type: 'REMOVE_SIMPLE',
    query: true
  });
}

function sort(dispatch) {
  dispatch({
    type: 'SORT_SIMPLE',
    orderBy: 'num'
  });
}

export {add, update, remove, removeAll, sort};
