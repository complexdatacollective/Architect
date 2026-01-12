/* eslint-env jest */

import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import VariableSpotlight from '../VariableSpotlight';

const mockStore = createStore(() => ({
  protocol: { present: {} },
}));

describe('VariableSpotlight', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('when options is empty it renders the empty message', () => {
    const subject = mount((
      <Provider store={mockStore}>
        <VariableSpotlight
          onSelect={noop}
          entity=""
          type=""
          onCancel={noop}
          onCreateOption={noop}
          options={[]}
        />
      </Provider>
    ));

    expect(subject.exists('.variable-spotlight__empty')).toBe(true);
  });

  it('it renders options', () => {
    const subject = mount((
      <Provider store={mockStore}>
        <VariableSpotlight
          onSelect={noop}
          entity=""
          type=""
          onCancel={noop}
          onCreateOption={noop}
          options={[
            {
              value: 'name',
              label: 'Name',
              type: 'text',
            },
            {
              value: 'age',
              label: 'Just a number',
              type: 'number',
            },
          ]}
        />
      </Provider>
    ));

    const items = subject.find('.spotlight-list-item');

    expect(items.at(0).text()).toEqual('Existing Variables');
    expect(items.at(1).text()).toEqual('Just a number');
    // SVG may be inlined as data URI or kept as file path depending on bundler
    expect(items.at(1).find('.icon').prop('src')).toBeDefined();
    expect(items.at(2).text()).toEqual('Name');
    expect(items.at(2).find('.icon').prop('src')).toBeDefined();
  });

  it('typing filters options', () => {
    const handleCancel = jest.fn();
    const handleSelect = jest.fn();
    const handleCreate = jest.fn();

    const subject = mount((
      <Provider store={mockStore}>
        <VariableSpotlight
          onSelect={handleSelect}
          entity=""
          type=""
          onCancel={handleCancel}
          onCreateOption={handleCreate}
          options={[
            {
              value: 'b068931cc450442b63f5b3d276ea4297',
              label: 'name',
              type: 'text',
            },
            {
              value: '7d637d275668ed6d41a9b97e6ad3a556',
              label: 'just a number',
              type: 'number',
            },
          ]}
        />
      </Provider>
    ));

    const Search = subject.find('Search input');

    let items;

    items = subject.find('.spotlight-list-item');
    expect(items.length).toBe(3);

    Search.simulate('change', { target: { value: 'nam' } });
    items = subject.find('.spotlight-list-item');
    expect(items.length).toBe(4);
    expect(items.at(0).text()).toEqual('Create');
    // The create-new div contains Icon and span children
    const createNewItem = items.at(1).find('.create-new');
    expect(createNewItem.text()).toContain('Create new variable called "nam".');
    expect(items.at(2).text()).toEqual('Existing Variables Containing "nam"');
    expect(items.at(3).text()).toEqual('name');
  });

  it('is keyboard navigable', () => {
    const handleCancel = jest.fn();
    const handleSelect = jest.fn();
    const handleCreate = jest.fn();

    const subject = mount((
      <Provider store={mockStore}>
        <VariableSpotlight
          onSelect={handleSelect}
          entity=""
          type=""
          onCancel={handleCancel}
          onCreateOption={handleCreate}
          options={[
            {
              value: 'b068931cc450442b63f5b3d276ea4297',
              label: 'name',
              type: 'text',
            },
            {
              value: '7d637d275668ed6d41a9b97e6ad3a556',
              label: 'just a number',
              type: 'number',
            },
          ]}
        />
      </Provider>
    ));

    const Search = subject.find('Search input');

    let items;

    Search.simulate('keydown', { key: 'ArrowDown' });
    Search.simulate('keydown', { key: 'ArrowDown' });
    items = subject.find('.spotlight-list-item');
    expect(items.at(1).hasClass('spotlight-list-item--selected')).toBe(false);
    expect(items.at(2).hasClass('spotlight-list-item--selected')).toBe(true);

    Search.simulate('keydown', { key: 'ArrowUp' });
    items = subject.find('.spotlight-list-item');
    expect(items.at(1).hasClass('spotlight-list-item--selected')).toBe(true);
    expect(items.at(2).hasClass('spotlight-list-item--selected')).toBe(false);

    expect(handleCancel.mock.calls.length).toBe(0);
    // This would close the window in actual use, but that's
    // managed by handleCancel and in this case it does nothing.
    Search.simulate('keydown', { key: 'Escape' });
    expect(handleCancel.mock.calls.length).toBe(1);

    expect(handleSelect.mock.calls.length).toBe(0);
    // Currently selected variable from keyboard navigation above
    Search.simulate('keydown', { key: 'Enter' });
    expect(handleSelect.mock.calls).toEqual([['7d637d275668ed6d41a9b97e6ad3a556']]);

    expect(handleCreate.mock.calls.length).toBe(0);
    Search.simulate('change', { target: { value: 'nam' } });
    // 0: create divider
    // 1: create new "nam" variable
    // 2: filter divider
    // 3: select "name" variable
    Search.simulate('keydown', { key: 'ArrowUp' });
    items = subject.find('.spotlight-list-item');
    expect(items.at(1).hasClass('spotlight-list-item--selected')).toBe(true);
    Search.simulate('keydown', { key: 'Enter' });
    expect(handleCreate.mock.calls).toEqual([['nam']]);
  });
});
