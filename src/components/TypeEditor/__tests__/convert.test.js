/* eslint-env jest */

import { format, parse } from '../convert';

const mockConfiguration = {
  label: 'Person',
  color: 'coral',
  icon: 'add-a-person',
};

const mockFormConfiguration = {
  label: 'Person',
  color: 'coral',
  icon: 'add-a-person',
};

describe('convert', () => {
  describe('format()', () => {
    it('correctly converts protocol into form compatable version', () => {
      expect(format(mockConfiguration)).toMatchObject(mockFormConfiguration);
    });
  });

  describe('parse()', () => {
    it('correctly converts from form compatable version to protocol version', () => {
      expect(parse(mockFormConfiguration)).toEqual(mockConfiguration);
    });
  });
});
