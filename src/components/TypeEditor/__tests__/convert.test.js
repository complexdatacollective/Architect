/* eslint-env jest */

import { parse, format } from '../convert';

const mockConfiguration = {
  label: 'Person',
  color: 'coral',
  displayVariable: 'nickname',
  iconVariant: 'add-a-person',
  variables: {
    1234: {
      name: 'closenessLayout',
      label: 'Closeness layout',
      description: 'Earthling readable description',
      type: 'layout',
      validation: {},
    },
    5678: {
      name: 'name',
      label: 'Name',
      description: 'Human readable description',
      type: 'text',
      validation: {
        required: true,
        minLength: 1,
        maxLength: 24,
      },
    },
  },
};

const mockFormConfiguration = {
  label: 'Person',
  color: 'coral',
  displayVariable: 'nickname',
  iconVariant: 'add-a-person',
  variables: [
    {
      id: '1234',
      name: 'closenessLayout',
      label: 'Closeness layout',
      description: 'Earthling readable description',
      type: 'layout',
      validation: [],
    },
    {
      id: '5678',
      name: 'name',
      label: 'Name',
      description: 'Human readable description',
      type: 'text',
      validation: [
        { type: 'required', value: true },
        { type: 'minLength', value: 1 },
        { type: 'maxLength', value: 24 },
      ],
    },
  ],
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
