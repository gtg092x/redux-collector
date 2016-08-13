import _ from 'lodash';

function defaultMatcher(arg, predicate, index) {
  if (predicate === undefined) {
    return true;
  } else if (_.isArray(predicate)) {
    return _.every(predicate, query => defaultMatcher(arg, query, index));
  } else if (_.isFunction(predicate)) {
    return predicate(arg, index);
  } else if(_.isBoolean(predicate)) {
    return predicate === true ? !!arg : !arg;
  } else if(!_.isPlainObject(predicate)) {
    return predicate === arg;
  } else if(predicate.$or) {
    return _.some(predicate.$or, query => defaultMatcher(arg, query, index));
  } else {
    return _.isMatch(arg, predicate);
  }
}

export {defaultMatcher};
