import collectify from '../src/redux-collector';
import chai from 'chai';
import _ from 'lodash';

const {assert} = chai;

function mapObject(obj, map) {
  return Object.keys(obj).reduce((pointer, key) => ({...pointer, [key]: map(obj[key])}), {});
}

function randomInt(...args) {
  const [ceil = 1000000, floor = 0] = args.slice(0).reverse();
  return Math.floor(Math.random() * (ceil - floor)) + floor;
}

export default function () {

  const checkIntegrity = (reducer, action) => {
     it ('should be a function', function() {
       assert.isFunction(reducer);
     });

    it ('should not alter state', function() {
      const incoming = [{foo: 'bar'}];
      const compareIncoming = _.cloneDeep(incoming);
      reducer(incoming, action);
      assert.deepEqual(incoming, compareIncoming);
    });
  };
  
  describe('add', function () {
    const addAction = 'ADD_TEST';
    const myReducer = collectify({
      defaultsTo: [],
      "RANDOMIZE": () => randomInt()
    }, {
      add: addAction
    });

    checkIntegrity(myReducer, {type: addAction, add: 0});
    it ("Should support Add", function () {

      let newArr = myReducer(undefined, {type: addAction, add: 0});
      assert.deepEqual([0], newArr);

      newArr = myReducer([1, 2], {type: addAction, add: 3});
      assert.deepEqual([1, 2, 3], newArr);

      newArr = myReducer([{}, {}, {}], {type: addAction, add: {foo: 'bar'}});
      assert.deepEqual([{}, {}, {}, {foo: 'bar'}], newArr);
    });

    it ("Should support Index", function () {

      let newArr = myReducer([1, 2], {type: addAction, add: 3, index: 0});
      assert.deepEqual([3, 1, 2], newArr);

      newArr = myReducer([1, 2], {type: addAction, add: 3, index: -1});
      assert.deepEqual([1, 3, 2], newArr);

      newArr = myReducer([1, 2], {type: addAction, add: 3, index: -2});
      assert.deepEqual([3, 1, 2], newArr);

      newArr = myReducer([1, 2], {type: addAction, add: 3, index: -3});
      assert.deepEqual([3, 1, 2], newArr);

      newArr = myReducer([1, 2], {type: addAction, add: 3, index: 10});
      assert.deepEqual([1, 2, 3], newArr);

    });

  });

  describe('sort', function () {
    
  });

  describe('addRange', function () {
    const addAction = 'ADD_RANGE_TEST';
    const myReducer = collectify({
      defaultsTo: [],
      "RANDOMIZE": () => randomInt()
    }, {
      addRange: addAction
    });

    checkIntegrity(myReducer, {type: addAction, add: 0});
    it ("Should support Add Range", function () {

      let newArr = myReducer(undefined, {type: addAction, add: [0]});
      assert.deepEqual([0], newArr);

      newArr = myReducer([1, 2], {type: addAction, add: [3, 4]});
      assert.deepEqual([1, 2, 3, 4], newArr);

      newArr = myReducer([{}, {}, {}], {type: addAction, add: [{foo: 'bar'}, {foo: 'buzz'}]});
      assert.deepEqual([{}, {}, {}, {foo: 'bar'}, {foo: 'buzz'}], newArr);
    });

    it ("Should support Index", function () {

      let newArr = myReducer([1, 2], {type: addAction, add: [3, 4], index: 0});
      assert.deepEqual([3, 4, 1, 2], newArr);

      newArr = myReducer([1, 2], {type: addAction, add: [3, 4], index: -1});
      assert.deepEqual([1, 3, 4, 2], newArr);

      newArr = myReducer([1, 2], {type: addAction, add: [3, 4], index: -2});
      assert.deepEqual([3, 4, 1, 2], newArr);

      newArr = myReducer([1, 2], {type: addAction, add: [3, 4], index: -3});
      assert.deepEqual([3, 4, 1, 2], newArr);

      newArr = myReducer([1, 2], {type: addAction, add: [3, 4], index: 10});
      assert.deepEqual([1, 2, 3, 4], newArr);

    });

  });

  describe('remove', function () {
    const removeAction = 'REMOVE_TEST';
    const myReducer = collectify({
      defaultsTo: [],
      "RANDOMIZE": () => randomInt()
    }, {
      remove: removeAction
    });

    checkIntegrity(myReducer, {type: removeAction, index: 0});
    it ("Should support Index", function () {

      let newArr = myReducer([10], {type: removeAction, index: 0});
      assert.deepEqual([], newArr);

      newArr = myReducer([1, 2, 3], {type: removeAction, index: -1});
      assert.deepEqual([1, 2], newArr);

    });

    it("Should support query", function() {

      let newArr = myReducer([10, 4], {type: removeAction, query: 4});
      assert.deepEqual([10], newArr);

      newArr = myReducer([10, 4], {type: removeAction, query: num => num < 5});
      assert.deepEqual([10], newArr);

      newArr = myReducer([{foo: 'bar'}, {foo: 'baz'}], {type: removeAction, query: {foo: 'baz'}});
      assert.deepEqual([{foo: 'bar'}], newArr);

      newArr = myReducer([{foo: 'bar'}, {foo: 'baz'}], {type: removeAction, query: true});
      assert.deepEqual([], newArr);

    });

    it ("Should support limit and skip", function () {

      const state = [1, 2, 3, 4, 5];
      let newArr = myReducer(state, {type: removeAction, limit: 3, skip: 1});
      assert.deepEqual([1, 5], newArr);

      newArr = myReducer(state, {type: removeAction, query: num => num < 4, limit: 2});
      assert.deepEqual([3, 4, 5], newArr);

    });
  });

  describe('move', function () {

  });

  describe('swap', function () {

  });

  describe('update', function () {
    const updateAction = 'UPDATE_TEST';
    const myReducer = collectify({
      defaultsTo: [],
      "RANDOMIZE": () => randomInt()
    }, {
      update: updateAction
    });

    const action = {type: 'RANDOMIZE'};

    checkIntegrity(myReducer, {type: updateAction, action});

    it ("Should run reducer", function () {
      let newArr = myReducer([-1], {type: updateAction, action});
      assert.notEqual(-1, newArr[0]);
      assert.equal(1, newArr.length);
    });

    it ("Should support Index", function () {

      let newArr = myReducer([-1, -1], {type: updateAction, action, index: 0});
      assert.notEqual(-1, newArr[0]);
      assert.equal(-1, newArr[1]);
      assert.equal(2, newArr.length);

    });

    it("Should support query", function() {

      let newArr = myReducer([-3, -1, -3], {type: updateAction, action, query: -3});
      assert.notEqual(-3, newArr[0]);
      assert.notEqual(-3, newArr[2]);
      assert.equal(-1, newArr[1]);
      assert.equal(3, newArr.length);

    });

    it ("Should support limit and skip", function () {
      let newArr = myReducer([-3, -1, -3], {type: updateAction, action, query: -3, limit: 1});
      assert.notEqual(-3, newArr[0]);
      assert.equal(-3, newArr[2]);
      assert.equal(-1, newArr[1]);
      assert.equal(3, newArr.length);

      newArr = myReducer([-3, -1, -3], {type: updateAction, action, query: -3, limit: 1, skip: 1});
      assert.equal(-3, newArr[0]);
    });
  });

}
