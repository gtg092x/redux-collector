import _ from 'lodash';

function defaultMatcher(arg, predicate) {
  if (_.isFunction(predicate)) {
    return predicate(arg);
  } else if(_.isBoolean(predicate)) {
    return predicate;
  } else if(!_.isPlainObject(predicate)) {
    return predicate === arg;
  } else {
    return _.isMatch(arg, predicate);
  }
}

export {defaultMatcher};
