import { createStore, combineReducers } from 'redux';
import _ from 'lodash';
import chai from 'chai';
import collectify from '../src/redux-collector';

const {assert} = chai;

export default function () {

  describe('should integreate with redux', function () {

    it('handle all dispatches args', function () {

      const store = createStore(collectify({
        add: "ADD",
        remove: "REMOVE"
      }, {
        defaultsTo: 0,
        "INCREMENT": state => state + 1
      }));


      const {dispatch, getState} = store;
      let toCompare = [];

      dispatch({type: 'ADD'});
      toCompare.push(0);
      assert.deepEqual(toCompare, getState());

      const toAdd = 10;
      dispatch({type: 'ADD', data: toAdd});
      toCompare.push(toAdd);
      assert.deepEqual(toCompare, getState());


      dispatch({type: 'ADD', data: toAdd});
      toCompare.push(toAdd);

      dispatch({type: 'INCREMENT'});
      toCompare = toCompare.map(item => item + 1);
      assert.deepEqual(toCompare, getState());


      dispatch({type: 'REMOVE', limit: 1, index: -1});
      toCompare.pop();
      assert.deepEqual(toCompare, getState());

    });

    it('integrates into a parent reducer', function () {

      const collectified = collectify({
        add: "ADD",
        remove: "REMOVE"
      }, {
        defaultsTo: 0,
        "INCREMENT": state => state + 1
      });

      function reducer(state = {items: []}, action = {}) {
        switch(action.type) {
          case 'ADD':
          case 'REMOVE':
          case 'INCREMENT':
            return {...state, items: collectified(state.items, action)};
          default:
            return state;
        }
      }

      const store = createStore(reducer);


      const {dispatch, getState} = store;
      let toCompare = {items: []};

      dispatch({type: 'ADD'});
      toCompare.items.push(0);
      assert.deepEqual(toCompare, getState());

      const toAdd = 10;
      dispatch({type: 'ADD', data: toAdd});
      toCompare.items.push(toAdd);
      assert.deepEqual(toCompare, getState());


      dispatch({type: 'ADD', data: toAdd});
      toCompare.items.push(toAdd);

      dispatch({type: 'INCREMENT'});
      toCompare.items = toCompare.items.map(item => item + 1);
      assert.deepEqual(toCompare, getState());


      dispatch({type: 'REMOVE', limit: 1, index: -1});
      toCompare.items.pop();
      assert.deepEqual(toCompare, getState());

    });
  });
}
