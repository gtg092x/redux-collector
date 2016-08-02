import { createStore, applyMiddleware, combineReducers } from 'redux';
import { collectorMiddleware } from '../../../../src/redux-collector';
import simple from '../reducers/injected';
//import simple from '../reducers/simple';
//import simple from '../reducers/extended';


const reducer = combineReducers({simple});
export default createStore(
  reducer,
  undefined,
  applyMiddleware(collectorMiddleware())
);
