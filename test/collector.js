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
    const myReducer = collectify([], {
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

  describe('addRange', function () {
    const addAction = 'ADD_RANGE_TEST';
    const myReducer = collectify([], {
      addRange: addAction
    });

    checkIntegrity(myReducer, {type: addAction, add: 0}, [{foo: 'bar'}]);
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

    it ("Should support after", function () {

      let newArr = myReducer([1, 2], {type: addAction, add: [3, 4], after: 1});
      assert.deepEqual([1, 3, 4, 2], newArr);

      newArr = myReducer([1, 2, 3, 4], {type: addAction, add: ['orange', 'peel'], after: item => item === 3});
      assert.deepEqual([1, 2, 3, 'orange', 'peel', 4], newArr);

      it ("Should support order", function () {

        let newArr = myReducer([1, 2], {type: addAction, after: 1, order: -1});
        assert.deepEqual([1, 2, 3, 4], newArr);

      });

    });

  });

  describe('remove', function () {
    const removeAction = 'REMOVE_TEST';
    const myReducer = collectify([], {
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

    it ("Should support order", function () {

      const state = [1, 2, 3, 4, 5];
      let newArr = myReducer(state, {type: removeAction, limit: 3, order: -1});
      assert.deepEqual([1, 2], newArr);


    });

  });

  describe('sort', function () {
    const sortAction = 'SORT_TEST';
    const myReducer = collectify([], {sort: sortAction});

    checkIntegrity(myReducer, {type: sortAction});
    it ("Should support order", function () {

      let newArr = myReducer([4, 3, 2, 1], {type: sortAction});
      assert.deepEqual([1, 2, 3, 4], newArr);

      newArr = myReducer([1, 2, 3, 4], {type: sortAction});
      assert.deepEqual([1, 2, 3, 4], newArr);

      newArr = myReducer([1, 2, 3, 4], {type: sortAction, order: 'desc'});
      assert.deepEqual([4, 3, 2, 1], newArr);

      newArr = myReducer([1, 2, 3, 4], {type: sortAction, order: -1});
      assert.deepEqual([4, 3, 2, 1], newArr);

      newArr = myReducer([1, 2, 3, 4], {type: sortAction, order: false});
      assert.deepEqual([4, 3, 2, 1], newArr);

    });

    it ("Should support sort", function () {

      const toSort = [{num: 4, num2: 1}, {num: 3, num2: 2}, {num: 2, num2: 3}, {num: 1, num2: 4}];
      let newArr = myReducer(toSort, {type: sortAction, sort: 'num'});
      assert.deepEqual(toSort.slice(0).reverse(), newArr);

      newArr = myReducer(toSort, {type: sortAction, sort: {num: -1}});
      assert.deepEqual(toSort, newArr);

      newArr = myReducer(toSort, {type: sortAction, sort: {num2: -1}});
      assert.deepEqual(toSort.slice(0).reverse(), newArr);

      newArr = myReducer(toSort, {type: sortAction, sort: {}});
      assert.deepEqual(toSort, newArr);

      newArr = myReducer(toSort, {type: sortAction, sort: (item) => -item.num2});
      assert.deepEqual(toSort.slice(0).reverse(), newArr);
    });

  });

  describe('move', function () {
    const moveAction = 'MOVE_TEST';
    const myReducer = collectify([], {
      move: moveAction
    });

    checkIntegrity(myReducer, {type: moveAction, add: 0});
    it ("Should support Move", function () {

      let newArr = myReducer([3, 4, 5, 6], {type: moveAction, from: 2, to: 0});
      assert.deepEqual([5, 3, 4, 6], newArr);

      newArr = myReducer([3, 4, 5, 6], {type: moveAction, from: [2, 3], to: 0});
      assert.deepEqual([5, 6, 3, 4], newArr);

      newArr = myReducer([3, 4, 5, 6], {type: moveAction, from: [1, 3], to: 0});
      assert.deepEqual([4, 5, 6, 3], newArr);

      newArr = myReducer([3, 4, 5, 6], {type: moveAction, from: [2, 3], to: 1});
      assert.deepEqual([3, 5, 6, 4], newArr);

      newArr = myReducer([3, 4, 5, 6], {type: moveAction, from: item => item > 4, to: 0});
      assert.deepEqual([5, 6, 3, 4], newArr);
    });
  });

  describe('swap', function () {
    const swapAction = 'SWAP_TEST';
    const myReducer = collectify([], {
      swap: swapAction
    });

    checkIntegrity(myReducer, {type: swapAction});
    it ("Should support Swap", function () {

      let newArr = myReducer([3, 4, 5, 6], {type: swapAction, indexes: [1, 3]});
      assert.deepEqual([3, 6, 5, 4], newArr);

      newArr = myReducer([3, 4, 5, 6], {type: swapAction, range: [1, 3]});
      assert.deepEqual([3, 6, 4, 5], newArr);
    });
  });

  describe('item reduce', function () {
    const myReducer = collectify({
      defaultsTo: [],
      "RANDOMIZE": () => randomInt()
    }, {});

    const action = {type: 'RANDOMIZE'};

    checkIntegrity(myReducer, action);

    it ("Should run reducer", function () {
      let newArr = myReducer([-1], action);
      assert.notEqual(-1, newArr[0]);
      assert.equal(1, newArr.length);
    });

    it ("Should support Index", function () {

      let newArr = myReducer([-1, -1], {...action, index: 0});
      assert.notEqual(-1, newArr[0]);
      assert.equal(-1, newArr[1]);
      assert.equal(2, newArr.length);

    });

    it("Should support query", function() {

      let newArr = myReducer([-3, -1, -3], {...action, query: -3});
      assert.notEqual(-3, newArr[0]);
      assert.notEqual(-3, newArr[2]);
      assert.equal(-1, newArr[1]);
      assert.equal(3, newArr.length);

      newArr = myReducer([-3, -1, -3], {...action, query: (item) => item === -3});
      assert.notEqual(-3, newArr[0]);
      assert.notEqual(-3, newArr[2]);
      assert.equal(-1, newArr[1]);
      assert.equal(3, newArr.length);

    });

    it ("Should support limit and skip", function () {
      let newArr = myReducer([-3, -1, -3], {...action, query: -3, limit: 1});
      assert.notEqual(-3, newArr[0]);
      assert.equal(-3, newArr[2]);
      assert.equal(-1, newArr[1]);
      assert.equal(3, newArr.length);

      newArr = myReducer([-3, -1, -3], {...action, query: -3, limit: 1, skip: 1});
      assert.equal(-3, newArr[0]);
    });
    it ("Should support order", function () {
      let newArr = myReducer([-3, -1, -3], {...action, query: -3, limit: 1, skip: 1, order: -1});
      assert.notEqual(-3, newArr[0]);
    });
    it ("Should handle weird queries", function() {
      assert.doesNotThrow(function() {
        myReducer([-3, -1, -3], {...action, query: () => null, limit: 1, skip: 1, order: -1});
        myReducer([-3, -1, -3], {...action, query: () => undefined, limit: -1, skip: 1, order: -1});
        myReducer([-3, -1, -3], {...action, query: 'foo', limit: 1, skip: null, order: () => null});
      });
    });
  });

}
