import {clamp} from '../src/lib';
import chai from 'chai';
import _ from 'lodash';

const {assert} = chai;
export default function () {
  describe('clamp index', function() {
    it('should support in range indexes', function() {
      let toClamp = 2;
      const range = 4;
      assert.equal(toClamp, clamp(range, toClamp));

      toClamp = 1;
      assert.equal(toClamp, clamp(range, toClamp));

      toClamp = 0;
      assert.equal(toClamp, clamp(range, toClamp));

      toClamp = 3;
      assert.equal(toClamp, clamp(range, toClamp));
    });

    it('should support post range indexes', function() {

      const range = 4;
      let toClamp = -1;
      assert.equal(3, clamp(range, toClamp));

      toClamp = -2;
      assert.equal(2, clamp(range, toClamp));

      toClamp = -3;
      assert.equal(1, clamp(range, toClamp));

      toClamp = -4;
      assert.equal(0, clamp(range, toClamp));

      toClamp = -5;
      assert.equal(0, clamp(range, toClamp));
    });

  });
}
