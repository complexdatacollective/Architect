/* eslint-env jest */

import { makeGetIsUsed, makeOptionsWithIsUsed } from '../isUsed';

const variable1 = '1234-1234-1234-1';
const variable2 = '1234-1234-1234-2';
const variable3 = '1234-1234-1234-3';
const variable4 = '1234-1234-1234-4';

const mockCodebook = {
  nodes: {
    person: {
      variables: {
        [variable1]: {},
        [variable2]: {},
        [variable3]: {},
        [variable4]: {},
      },
    },
  },
};

describe('makeGetIsUsed', () => {
  it('returns false when variables are not in use', () => {
    const notUsedState = {
      protocol: {
        present: {
          codebook: mockCodebook,
          stages: [
          ],
        },
      },
    };

    const notUsedResult = makeGetIsUsed()(notUsedState);

    expect(notUsedResult).toEqual({
      [variable1]: false,
      [variable2]: false,
      [variable3]: false,
      [variable4]: false,
    });
  });

  it('checks codebook for variable usage', () => {
    const state = {
      protocol: {
        present: {
          codebook: mockCodebook,
          stages: [
            { [variable1]: 'foo' },
            { variableAsKey: variable2 },
            {
              nestedVariable: {
                moreNested: {
                  nestedFurther: {
                    [variable3]: false,
                  },
                },
              },
            },
          ],
        },
      },
    };

    const result = makeGetIsUsed()(state);

    expect(result).toEqual({
      [variable1]: true,
      [variable2]: true,
      [variable3]: true,
      [variable4]: false,
    });
  });

  it('checks form for variable usage', () => {
    const state = {
      protocol: {
        present: {
          codebook: mockCodebook,
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

    // Also check we can set form name
    const result = makeGetIsUsed(['formName'])(state);

    expect(result).toEqual({
      [variable1]: true,
      [variable2]: false,
      [variable3]: false,
      [variable4]: false,
    });
  });
});

describe('makeOptionsWithIsUsed', () => {
  it('appends used state to options', () => {
    const state = {
      protocol: {
        present: {
          codebook: mockCodebook,
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
    const result = makeOptionsWithIsUsed(['formName'])(state, mockOptions);

    expect(result).toEqual([
      { value: variable1, label: '1', isUsed: true },
      { value: variable2, label: '2', isUsed: false },
      { value: variable3, label: '3', isUsed: false },
      { value: variable4, label: '4', isUsed: false },
    ]);
  });
});
