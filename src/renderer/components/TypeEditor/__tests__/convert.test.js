/* eslint-env jest */

import { parse, format } from '../convert';

const mockConfiguration = {
  label: 'Person',
  color: 'coral',
  iconVariant: 'add-a-person',
};

const mockFormConfiguration = {
  label: 'Person',
  color: 'coral',
  iconVariant: 'add-a-person',
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
