/* eslint-env jest */

import React from 'react';
import { shallow } from 'enzyme';
import {
  withDisplayLabelChangeHandler,
} from '../withDisplayLabelChangeHandler';

const MockComponent = withDisplayLabelChangeHandler(() => null);

describe('withDisplayLabelChangeHandler() HOC', () => {
  it('provides a `handleChangeDisplayLabel` prop', () => {
    //  Calls updateField to update additionalProperties with filtered rows
    const mockUpdateField = jest.fn();
    const mockCardOptions = {
      additionalProperties: [
        { variable: '1234-1234-1', label: 'foo' },
        { variable: '1234-1234-2', label: 'bar' },
        { variable: '1234-1234-3', label: 'bazz' },
      ],
    };

    const subject = shallow((
      <MockComponent
        updateField={mockUpdateField}
        cardOptions={mockCardOptions}
      />
    ));

    const handler = subject.prop('handleChangeDisplayLabel');

    // simulate changing displayLabel to '1234-1234-1'
    handler(null, '1234-1234-1');

    // '1234-1234-1' should be removed from additionalProperties
    expect(mockUpdateField.mock.calls[0]).toEqual(
      [
        'cardOptions.additionalProperties',
        [
          { variable: '1234-1234-2', label: 'bar' },
          { variable: '1234-1234-3', label: 'bazz' },
        ],
      ],
    );
  });
});
