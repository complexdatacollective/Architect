/* eslint-env jest */

import { makeGetIsUsed, makeOptionsWithIsUsed } from '../isUsed';

const variable1 = '1234-1234-1234-1';
const variable2 = '1234-1234-1234-2';
const variable3 = '1234-1234-1234-3';
const variable4 = '1234-1234-1234-4';
const variable5 = '1234-1234-1234-5';
const variable6 = '1234-1234-1234-6';
const variable7 = '1234-1234-1234-7';
const variable8 = '1234-1234-1234-8';

const mockCodebookWithoutUse = {
  ego: {
    variables: {
      [variable5]: {},
      [variable6]: {},
    },
  },
  node: {
    person: {
      variables: {
        [variable1]: {},
        [variable2]: {},
        [variable3]: {},
        [variable4]: {},
      },
    },
  },
  edge: {
    friendship: {
      variables: {
        [variable7]: {},
        [variable8]: {},
      },
    },
  },
};

const mockProtocolWithoutUse = {
  present: {
    codebook: mockCodebookWithoutUse,
    stages: [
      {
        id: '1',
      },
    ],
  },
};

const mockReduxFormsWithoutUse = {
  'edit-stage': {
    values: {},
  },
};

const mockStateWithoutUse = {
  protocol: mockProtocolWithoutUse,
  form: mockReduxFormsWithoutUse,
};

describe('makeGetIsUsed', () => {
  it('returns false when a variable is not present', () => {
    const result = makeGetIsUsed()(mockStateWithoutUse);

    expect(result).toEqual({
      [variable1]: false,
      [variable2]: false,
      [variable3]: false,
      [variable4]: false,
      [variable5]: false,
      [variable6]: false,
      [variable7]: false,
      [variable8]: false,
    });
  });

  it('returns true when a variable is present in the protocol', () => {
    const stateWithProtocolUse = {
      ...mockStateWithoutUse,
      protocol: {
        ...mockProtocolWithoutUse,
        present: {
          ...mockProtocolWithoutUse.present,
          stages: [
            {
              id: '1',
              [variable1]: 'foo',
              thing: {
                variableAsKey: variable2,
                nested: {
                  even: [
                    {
                      moreNested: {
                        with: variable3,
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    };

    const result = makeGetIsUsed()(stateWithProtocolUse);

    expect(result).toEqual({
      [variable1]: true,
      [variable2]: true,
      [variable3]: true,
      [variable4]: false,
      [variable5]: false,
      [variable6]: false,
      [variable7]: false,
      [variable8]: false,
    });
  });

  describe('redux forms', () => {
    const stateWithFormUse = {
      ...mockStateWithoutUse,
      form: {
        ...mockReduxFormsWithoutUse,
        formName: {
          values: {
            [variable1]: 'foo',
          },
        },
        'edit-stage': {
          values: {
            [variable2]: 'foo',
            thing: {
              foo: variable3,
            },
          },
        },
      },
    };

    describe('returns true when a variable is present in redux forms', () => {
      it('returns from default form names only without parameters', () => {
        const result = makeGetIsUsed()(stateWithFormUse);

        expect(result).toEqual({
          [variable1]: false,
          [variable2]: true,
          [variable3]: true,
          [variable4]: false,
          [variable5]: false,
          [variable6]: false,
          [variable7]: false,
          [variable8]: false,
        });
      });

      it('allows the redux form name to be specified to return specific form', () => {
        // Also check we can set form name
        const result = makeGetIsUsed({ formNames: ['formName'] })(stateWithFormUse);

        expect(result).toEqual({
          [variable1]: true,
          [variable2]: false,
          [variable3]: false,
          [variable4]: false,
          [variable5]: false,
          [variable6]: false,
          [variable7]: false,
          [variable8]: false,
        });
      });
    });
  });

  it('checks codebook for variable validation use', () => {
    const stateWithCodebookUse = {
      ...mockStateWithoutUse,
      protocol: {
        ...mockProtocolWithoutUse,
        present: {
          codebook: {
            ...mockCodebookWithoutUse,
            node: {
              ...mockCodebookWithoutUse.node,
              person: {
                ...mockCodebookWithoutUse.node.person,
                variables: {
                  ...mockCodebookWithoutUse.node.person.variables,
                  [variable1]: {
                    validation: {
                      sameAs: variable2,
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    const result = makeGetIsUsed()(stateWithCodebookUse);

    expect(result).toEqual({
      [variable1]: false,
      [variable2]: true,
      [variable3]: false,
      [variable4]: false,
      [variable5]: false,
      [variable6]: false,
      [variable7]: false,
      [variable8]: false,
    });
  });

  describe('makeOptionsWithIsUsed', () => {
    it('appends used state to options', () => {
      const state = {
        protocol: {
          present: {
            codebook: mockCodebookWithoutUse,
            stages: [],
          },
        },
        form: {
          formName: {
            values: {
              foo: variable1,
            },
          },
        },
      };

      const mockOptions = [
        { value: variable1, label: '1' },
        { value: variable2, label: '2' },
        { value: variable3, label: '3' },
        { value: variable4, label: '4' },
      ];

      // Also check we can set form name
      const result = makeOptionsWithIsUsed({ formNames: ['formName'] })(state, mockOptions);

      expect(result).toEqual([
        { value: variable1, label: '1', isUsed: true },
        { value: variable2, label: '2', isUsed: false },
        { value: variable3, label: '3', isUsed: false },
        { value: variable4, label: '4', isUsed: false },
      ]);
    });
  });
});
