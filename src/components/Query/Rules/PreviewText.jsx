import React from 'react';
import PropTypes from 'prop-types';
import {
  get, isArray, isNil, join,
} from 'lodash';
import PreviewNode from '../../sections/fields/EntitySelectField/PreviewNode';
import PreviewEdge from '../../sections/fields/EntitySelectField/PreviewEdge';
import { SimpleVariablePill } from '../../Form/Fields/VariablePicker/VariablePill';

const operatorsAsText = (isEgo) => ({
  EXISTS: 'where',
  NOT_EXISTS: 'without',
  EXACTLY: isEgo ? 'that is exactly equal to' : 'is exactly equal to',
  NOT: isEgo ? 'that is not' : 'is not',
  GREATER_THAN: isEgo ? 'that is greater than' : 'is greater than',
  GREATER_THAN_OR_EQUAL: isEgo ? 'that is greater than or equal to' : 'is greater than or equal to',
  LESS_THAN: isEgo ? 'that is less than' : 'is less than',
  LESS_THAN_OR_EQUAL: isEgo ? 'that is less than or equal to' : 'is less than or equal to',
  CONTAINS: isEgo ? 'that contains' : 'contains',
  DOES_NOT_CONTAIN: isEgo ? 'that does not contain' : 'does not contain',
  INCLUDES: isEgo ? 'that includes' : 'includes',
  NOT_INCLUDES: isEgo ? 'that does not include' : 'does not include',
  OPTIONS_GREATER_THAN: isEgo ? 'that has selected options greater than' : 'has selected options greater than',
  OPTIONS_LESS_THAN: isEgo ? 'that has selected options less than' : 'has selected options less than',
  OPTIONS_EQUALS: isEgo ? 'that has selected options equal to' : 'has selected options equal to',
  OPTIONS_NOT_EQUALS: isEgo ? 'that has selected options not equal to' : 'has selected options not equal to',
});

const typeOperatorsAsText = {
  EXISTS: 'exists',
  NOT_EXISTS: 'does not exist',
};

const formatValue = (value) => {
  switch (typeof value) {
    case 'boolean':
      return value ? 'true' : 'false';
    case 'object': {
      if (isArray(value)) {
        return join(value, ', ');
      }
      return value;
    }
    default:
      return value;
  }
};

export const Join = ({ value }) => (
  <fieldset className="rules-preview-text__join">
    <legend>
      { value.toLowerCase() }
    </legend>
  </fieldset>
);
Join.propTypes = { value: PropTypes.string };
Join.defaultProps = { value: '' };

const Type = ({ children }) => (<div className="rules-preview-text__type">{children}</div>);
Type.propTypes = { children: PropTypes.node };
Type.defaultProps = { children: '' };

const Entity = ({ children }) => (
  <div className="rules-preview-text__entity">
    {children}
    s
  </div>
);
Entity.propTypes = { children: PropTypes.node };
Entity.defaultProps = { children: '' };

const Variable = ({ children }) => (<div className="rules-preview-text__variable">{children}</div>);
Variable.propTypes = { children: PropTypes.node };
Variable.defaultProps = { children: '' };

const Operator = ({ value, isEgo }) => (
  <div className="rules-preview-text__operator">
    {get(operatorsAsText(isEgo), value, value.toLowerCase())}
  </div>
);
Operator.propTypes = {
  value: PropTypes.string,
  isEgo: PropTypes.bool,
};

Operator.defaultProps = {
  value: '',
  isEgo: false,
};

const TypeOperator = ({ value }) => (
  <div className="rules-preview-text__operator">
    {get(typeOperatorsAsText, value, value.toLowerCase())}
  </div>
);
TypeOperator.propTypes = { value: PropTypes.string };
TypeOperator.defaultProps = { value: '' };

const Value = ({ value }) => {
  const formattedValue = formatValue(value);
  return (
    <div className="rules-preview-text__value">{formattedValue}</div>
  );
};
Value.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
  ]),
};
Value.defaultProps = { value: '' };

const Copy = ({ children }) => (<div className="rules-preview-text__copy">{children}</div>);
Copy.propTypes = { children: PropTypes.string };
Copy.defaultProps = { children: '' };

const PreviewText = ({ type, options }) => {
  if (type === 'ego') {
    return (
      <>
        <span style={{ '--node--label': 'var(--text-dark)' }}><PreviewNode label="Ego" color="color-platinum" /></span>
        <Copy>has</Copy>
        <SimpleVariablePill label={options.attribute} type={options.variableType} />
        <Operator value={options.operator} isEgo />
        <Value value={options.value} />
      </>
    );
  }

  const PreviewComponent = type === 'edge' ? PreviewEdge : PreviewNode;

  if (isNil(options.attribute)) {
    return (
      <>
        <PreviewComponent color={options.typeColor} label={options.typeLabel} />
        <TypeOperator value={options.operator} />
      </>
    );
  }
  if (isNil(options.value)) {
    return (
      <>
        <PreviewComponent color={options.typeColor} label={options.typeLabel} />
        <Operator value={options.operator} />
        <Variable>{options.attribute}</Variable>
      </>
    );
  }
  return (
    <>
      <PreviewComponent color={options.typeColor} label={options.typeLabel} />
      <Copy>where</Copy>
      <SimpleVariablePill label={options.attribute} type={options.variableType} />
      <Operator value={options.operator} />
      <Value value={options.value} />
    </>
  );
};

PreviewText.propTypes = {
  type: PropTypes.string.isRequired,
  options: PropTypes.shape({
    attribute: PropTypes.string,
    operator: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.array,
    ]),
    variableType: PropTypes.string,
    typeColor: PropTypes.string,
    typeLabel: PropTypes.string,
  }).isRequired,
};

export default PreviewText;
