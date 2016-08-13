import _ from 'lodash';

import {sortAliases} from './config';
import {contains, clamp} from './lib';

function normalizeOrder(orderArg) {
  const order = _.isString(orderArg)
    ? orderArg.toLowerCase()
    : orderArg;
  if (contains(sortAliases.desc, orderArg)) {
    return 'desc';
  }
  if (contains(sortAliases.asc, orderArg)) {
    return 'asc';
  }
  return order;
}

function normalizeSortArgs({sort, orders, order, ...rest}) {

  if (sort === undefined && orders === undefined && order === undefined) {
    return rest;
  }

  if (_.isPlainObject(sort)) {
    const [sorts, orders] = Object.keys(sort).reduce(([sorts, orders], key) => {
      const orderArg = sort[key];
      return [
        [...sorts, key],
        [...orders, normalizeOrder(orderArg)]
      ];
    }, [[], []]);
    return {sort: sorts, orders: orders, ...rest};
  }

  const toOrder = orders === undefined
    ? [order]
    : orders;
  return {sort, orders: toOrder.map(normalizeOrder), ...rest};
}

function isNotUndefined(val) {
  return val !== undefined;
}

function normalizeIndexArgs({indexes = [], index, ranges = [], range, queries = [], query, ...rest}) {

  return {
    indexes: [index, ...indexes].filter(isNotUndefined),
    queries: [query, ...queries].filter(isNotUndefined),
    ranges: [range, ...ranges].filter(isNotUndefined),
    ...rest
  };

}

function normalizeAction(indexOf, state, action) {
  const {skip, limit = state.length, indexes, index, after, range, ...rest} = action;
  let toSkip = skip;
  let toLimit = limit;

  if (index !== undefined) {
    toLimit = 1;
    toSkip = clamp(state.length, index);
  } else if (range !== undefined) {
    const [start, end] = range.map(clamp.bind(undefined, state.length));
    toLimit = (end + 1) - start;
    toSkip = start;
  } else if (after !== undefined) {
    toSkip = indexOf(state, after, skip) + 1;
  }
  if (indexes !== undefined) {
    const query = rest.query === undefined ? [] : [rest.query];
    rest.query = [...query, (item, index) => contains(indexes, index)];
  }
  return {skip: toSkip, indexes, limit: toLimit, ...rest};
}

function normalizeFrom(from) {
  return _.isNumber(from)
    ? {index: from}
    : _.isArray(from)
      ? {indexes: from}
      : _.isFunction(from)
        ? {query: from}
        : from;
}

function normalizeTo(to) {

  if (_.isArray(to)) {
    throw '[Redux Collector] `to` must be a single index. You passed: ' + to;
  }

  return _.isNumber(to)
    ? {index: to}
    : _.isFunction(to)
      ? {query: to}
      : to;
}


export {normalizeOrder, normalizeSortArgs, normalizeIndexArgs, normalizeAction, normalizeFrom, normalizeTo};
