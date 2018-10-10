/* eslint-env jest */

import { range } from 'lodash';
import safeName from '../safeName';

const testString = range(32, 127).map(code => String.fromCharCode(code)).join();

describe('safeName()', () => {
  it('strips non alphanumerics', () => {
    expect(safeName(testString)).toEqual('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
  });
});
