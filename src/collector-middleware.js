import {generateCollector} from './default-collector';

function collectorMiddleware(...args) {

  const options = args.pop();
  const [$$collector = generateCollector(options)] = args;

  return function ({ getState, dispatch }) {
    return (next) => (action) => {

      if (!action.add && !action.query && !action.orderBy) {
        return next(action);
      }

      return next({
        ...action,
        $$collector
      });
    }
  };
}

export { collectorMiddleware };
