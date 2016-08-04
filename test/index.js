import collector from './collector';
import withRedux from './collectorRedux';
import withPipeline from './reduxPipeline';
import lib from './lib';

describe('Collector', collector);
describe('With Redux', withRedux);
describe('With Pipeline', withPipeline);
describe('Lib', lib);
