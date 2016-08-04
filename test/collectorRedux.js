import { createStore, combineReducers } from 'redux';
import _ from 'lodash';
import chai from 'chai';
import collectify from '../src/redux-collector';

const {assert} = chai;

export default function () {

  describe('should integreate with redux', function () {

    it('handle all dispatches args', function () {

      const store = createStore(collectify({
        defaultsTo: 0,
        "INCREMENT": state => state + 1
      }, {
        add: "ADD",
        remove: "REMOVE"
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
  });
}
