/* eslint-env jest */

import React from 'react';
import { createStore } from 'redux';
import { shallow } from 'enzyme';
import withExternalDataPropertyOptions from '../withExternalDataPropertyOptions';

const mockState = {
  protocol: {
    present: {
      externalData: {
        foo: {
          nodes: [
            { type: 'bar', attributes: { alpha: 1, bravo: 2 } },
            { type: 'bar', attributes: { charlie: 3, bravo: 2 } },
          ],
        },
      },
      variableRegistry: {
        node: {
          bar: {
            variables: {
              alpha: { name: 'ALPHA' },
              bravo: { name: 'BRAVO' },
              charlie: { name: 'CHARLIE' },
            },
          },
        },
      },
    },
  },
};

const mockStore = createStore(state => state, mockState);

const MockComponent = withExternalDataPropertyOptions(() => null);

describe('withExternalDataPropertyOptions() HOC', () => {
  it('provides a `externalDataPropertyOptions` prop', () => {
    const dataSource = 'foo';
    const nodeType = 'bar';

    const subject = shallow((
      <MockComponent
        store={mockStore}
        dataSource={dataSource}
        nodeType={nodeType}
      />
    ));

    expect(subject.prop('externalDataPropertyOptions')).toEqual([
      { value: 'alpha', label: 'ALPHA' },
      { value: 'bravo', label: 'BRAVO' },
      { value: 'charlie', label: 'CHARLIE' },
    ]);
  });
});
