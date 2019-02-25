/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import { Form } from '../Form';

const requiredProps = {
  onCancel: () => {},
  handleSubmit: () => {},
};

const getSubject = props =>
  shallow((
    <Form
      {...requiredProps}
      {...props}
    />
  ));

describe('Form', () => {
  describe('handlers', () => {
    it('handleSubmit', () => {
      const mockProps = {
        handleSubmit: jest.fn(),
      };

      const subject = getSubject(mockProps);

      const saveAndContinueButton = subject.find('Button[type="submit"]');

      expect(mockProps.handleSubmit.mock.calls.length).toBe(0);

      saveAndContinueButton.simulate('click');

      expect(mockProps.handleSubmit.mock.calls.length).toBe(1);
    });

    it('onCancel', () => {
      const mockProps = {
        onCancel: jest.fn(),
      };

      const subject = getSubject(mockProps);

      const cancelButton = subject.find('Button[type="button"]');

      expect(mockProps.onCancel.mock.calls.length).toBe(0);

      cancelButton.simulate('click');

      expect(mockProps.onCancel.mock.calls.length).toBe(1);
    });
  });
});
