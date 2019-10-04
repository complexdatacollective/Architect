/* eslint-env jest */

import testState from '../../__tests__/testState.json';
import {
  asOption,
  propertyMaps,
  getTypes,
  getType,
  getVariables,
  getVariable,
  getVariableOptions,
} from '../codebook';

const getOptions = mergeProps => ({
  includeDraft: false,
  ...mergeProps,
});

describe('codebook selectors', () => {
  describe('getTypes', () => {
    it('returns list of types', () => {
      const types = getTypes(testState);
      expect(types).toHaveLength(6);
      expect(types).toMatchSnapshot();
    });
  });

  describe('getType', () => {
    it('returns type object with meta', () => {
      const subject = { entity: 'node', type: 'bar' };
      const options = getOptions({ subject });
      const type = getType(testState, options);
      expect(type).toHaveProperty('properties');
      expect(type).toHaveProperty('subject', subject);
      expect(type).toMatchSnapshot();
    });
  });

  describe('getVariables', () => {
    it('gets all variables from the codebook with meta data', () => {
      const variables = getVariables(testState);
      expect(variables).toHaveLength(12);
      variables.forEach((variable) => {
        expect(variable).toHaveProperty('id');
        expect(variable).toHaveProperty('properties');
        expect(variable).toHaveProperty('subject');
        expect(variable).toHaveProperty('inUse');
        expect(variable).toHaveProperty('usage');
        expect(variable).toMatchSnapshot();
      });
    });
  });

  describe('getVariable', () => {
    const id = 'alpha';
    const options = getOptions({ id });
    const variable = getVariable(testState, options);
    expect(variable).toHaveProperty('properties');
    expect(variable).toHaveProperty('subject');
    expect(variable).toHaveProperty('inUse');
    expect(variable).toHaveProperty('usage');
    expect(variable).toMatchSnapshot();
  });

  describe('getVariableOptions', () => {
    const id = '1234-1234-2';
    const options = getOptions({ id });
    const variableOptions = getVariableOptions(testState, options);
    expect(variableOptions).toHaveLength(2);
    expect(variableOptions).toMatchSnapshot();
  });

  describe('asOption', () => {
    const types = getTypes(testState);

    const typeOptions = types.map(asOption(propertyMaps.entity));
    typeOptions.forEach((option) => {
      expect(option).toHaveProperty('value');
      expect(option).toHaveProperty('label');
      expect(option).toHaveProperty('color');
    });

    const variables = getVariables(testState);
    const variableOptions = variables.map(asOption());
    variableOptions.forEach((option) => {
      expect(option).toHaveProperty('value');
      expect(option).toHaveProperty('label');
      expect(option).toHaveProperty('type');
    });
  });
});
