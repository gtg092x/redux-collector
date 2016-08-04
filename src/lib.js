import _ from 'lodash';
function clamp(range, indexArg) {
  let index = indexArg < 0
    ? indexArg + range
    : indexArg;

  return Math.max(Math.min(index, range), 0);
}

function contains(arr, val) {
  return _.indexOf(arr, val) > -1;
}


function mapIndexes(arr) {
  return arr.map((item, index) => ({item, index}));
}

function unMapIndexes(arr) {
  return _.sortBy(arr, 'index').map(({item}) => item);
}

function resultTransform (result) {
  return unMapIndexes(result);
}

function sortResultTransform (result) {
  return result.map(({item}) => item);
}

function addWrapper(item, index) {
  return {item, index};
}



function sortTransform(sort, order) {

  if (sort === undefined) {
    if (_.size(order) === 0) {
      return ({item, index}) => item;
    } else {
      return ({item, index}) => index;
    }
  }
  const sortArr = _.isArray(sort) ? sort : [sort];
  return sortArr.map(sorter => {
    if (_.isFunction(sorter)) {
      return ({item}) => sorter(item);
    }
    return ({item}) => item[sorter];
  });
}

function matcherWrap (fn, {item}, ...args) {
  return fn.call(this, item, ...args);
}


export {clamp, matcherWrap, contains, mapIndexes, unMapIndexes, resultTransform, sortResultTransform, addWrapper, sortTransform};
