import pipeline from 'redux-pipeline';
import chai from 'chai';
import _ from 'lodash';
import collectify from '../src/redux-collector';

const {assert} = chai;

export default function () {

  describe('should integreate with pipeline', function () {

    it('handle all dispatches args', function () {

      const spoil = (state) => state + ' - gross';

      const defaults = {breads: ['wheat', 'white'], cheeses: ['cheddar'], lunch: true};
      const tracker = _.cloneDeep(defaults);
      const myReducer = pipeline(
        defaults,
        ['breads', collectify({add: 'ADD_BREAD'}, {'SPOIL_BREAD': spoil})],
        ['cheeses', collectify({add: 'ADD_CHEESE'}, {'SPOIL_CHEESE': spoil})],
        {
          $: 'lunch',
          "END_LUNCH": () => false
        }
      );

      let state;
      tracker.breads.push('sourdough');
      state = myReducer(state, {type: 'ADD_BREAD', data: 'sourdough'});

      assert.deepEqual(tracker, state);

      tracker.cheeses.push('swiss');
      state = myReducer(state, {type: 'ADD_CHEESE', data: 'swiss'});

      assert.deepEqual(tracker, state);

      tracker.lunch = false;
      state = myReducer(state, {type: 'END_LUNCH'});

      assert.deepEqual(tracker, state);

      tracker.breads = tracker.breads.map(bread => bread + ' - gross');
      state = myReducer(state, {type: 'SPOIL_BREAD'});

      assert.deepEqual(tracker, state);

      tracker.cheeses = tracker.cheeses.map(bread => bread + ' - gross');
      state = myReducer(state, {type: 'SPOIL_CHEESE'});

      assert.deepEqual(tracker, state);

    });
    it ("Should throw an error if you bork config", function() {
      assert.throw(function() {
        const spoil = (state) => state + ' - gross';
        pipeline(
          defaults,
          ['breads', collectify({add: 'ADD_BREAD'}, {$: 'fail', 'SPOIL_BREAD': spoil})],
          ['cheeses', collectify({add: 'ADD_CHEESE'}, {$: 'fail', 'SPOIL_CHEESE': spoil})],
          {
            $: 'lunch',
            "END_LUNCH": () => false
          }
        )
      });
    });
  });
}
