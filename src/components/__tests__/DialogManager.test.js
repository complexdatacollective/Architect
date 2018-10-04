/* eslint-env jest */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { DialogManager } from '../DialogManager';

const warningDialog = () => ({
  id: Math.random(),
  type: 'Warning',
  title: 'Warning!',
  text: 'Something happened',
  confirm: jest.fn(),
});

const confirmDialog = () => ({
  id: Math.random(),
  type: 'Confirm',
  title: 'Do you want to confirm the thing?',
  text: 'We might have more details here',
  confirm: jest.fn(),
  cancel: jest.fn(),
});

const noticeDialog = () => ({
  id: Math.random(),
  type: 'Notice',
  title: 'Hi',
  text: 'Notice me',
  confirm: jest.fn(),
});

const makeDialogs = () => ([
  warningDialog(),
  confirmDialog(),
  noticeDialog(),
]);

const makeProps = () => ({
  closeDialog: jest.fn(),
});

describe('<DialogManager />', () => {
  it('Renders nothing when dialogs empty', () => {
    const component = shallow(<DialogManager {...makeProps()} />);
    expect(component.find('Warning').length).toBe(0);
    expect(component.find('Confirm').length).toBe(0);
    expect(component.find('Notice').length).toBe(0);
  });

  it('It renders dialogs', () => {
    const component = shallow(<DialogManager {...makeProps()} dialogs={makeDialogs()} />);
    expect(component.find('Warning').length).toBe(1);
    expect(component.find('Confirm').length).toBe(1);
    expect(component.find('Notice').length).toBe(1);
  });

  describe('handles confirm/cancel callbacks', () => {
    it('Wires up <Warning /> Dialog', () => {
      const mockProps = makeProps();
      const mockWarningDialog = warningDialog();
      const component = mount(<DialogManager {...mockProps} dialogs={[mockWarningDialog]} />);

      component.find('Warning button').at(0).simulate('click');
      expect(mockWarningDialog.confirm.mock.calls.length).toBe(1);
      expect(mockProps.closeDialog.mock.calls.length).toBe(1);
    });

    it('Wires up <Notice /> Dialog', () => {
      const mockProps = makeProps();
      const mockNoticeDialog = noticeDialog();
      const component = mount(<DialogManager {...mockProps} dialogs={[mockNoticeDialog]} />);

      component.find('Notice button').at(0).simulate('click');
      expect(mockNoticeDialog.confirm.mock.calls.length).toBe(1);
      expect(mockProps.closeDialog.mock.calls.length).toBe(1);
    });

    it('Wires up <Confirm /> Dialog', () => {
      const mockProps = makeProps();
      const mockConfirmDialog = confirmDialog();
      const component = mount(<DialogManager {...mockProps} dialogs={[mockConfirmDialog]} />);

      component.find('Confirm button').at(0)
        .simulate('click');
      expect(mockConfirmDialog.confirm.mock.calls.length).toBe(1);
      expect(mockProps.closeDialog.mock.calls.length).toBe(1);

      component.find('Confirm button').at(1)
        .simulate('click');
      expect(mockConfirmDialog.cancel.mock.calls.length).toBe(1);
      expect(mockProps.closeDialog.mock.calls.length).toBe(2);
    });
  });
});
