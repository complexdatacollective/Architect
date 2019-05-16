import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

const operatorsAsText = {
  // IS: 'is',
  // IS_NOT: 'is_not',
  EXISTS: 'with',
  NOT_EXISTS: 'without',
  EXACTLY: 'exactly',
  NOT: 'is not',
  GREATER_THAN: 'greater than',
  GREATER_THAN_OR_EQUAL: 'greater than or equal to',
  LESS_THAN: 'less than',
  LESS_THAN_OR_EQUAL: 'less that or equal to',
};

const typeOperatorsAsText = {
  EXISTS: 'is',
  NOT_EXISTS: 'is not',
};

const formatValue = (value) => {
  switch (typeof value) {
    case 'boolean':
      return value ? 'true' : 'false';
    default:
      return value;
  }
};

export const Join = ({ value }) => (<div className="rules-preview-text__join">{ value.toLowerCase() }</div>);
Join.propTypes = { value: PropTypes.string };
Join.defaultProps = { value: '' };

const Type = ({ children }) => (<div className="rules-preview-text__type">{children}</div>);
Type.propTypes = { children: PropTypes.node };
Type.defaultProps = { children: '' };

const Entity = ({ children }) => (<div className="rules-preview-text__entity">{children}</div>);
Entity.propTypes = { children: PropTypes.node };
Entity.defaultProps = { children: '' };

const Variable = ({ children }) => (<div className="rules-preview-text__variable">{children}</div>);
Variable.propTypes = { children: PropTypes.node };
Variable.defaultProps = { children: '' };

const Operator = ({ value }) => (
  <div className="rules-preview-text__operator">
    {get(operatorsAsText, value, value.toLowerCase())}
  </div>
);
Operator.propTypes = { value: PropTypes.string };
Operator.defaultProps = { value: '' };

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
  ]),
};
Value.defaultProps = { value: '' };

const Copy = ({ children }) => (<div className="rules-preview-text__copy">{children}</div>);
Copy.propTypes = { children: PropTypes.string };
Copy.defaultProps = { children: '' };

const PreviewText = ({ type, options }) => {
  switch (type) {
    case 'alter': {
      if (!options.attribute) {
        return (
          <Fragment>
            <TypeOperator value={options.operator} />
            <Entity>alter</Entity>
            <Copy>of type</Copy>
            <Type>{options.type}</Type>
          </Fragment>
        );
      }
      if (!options.value) {
        return (
          <Fragment>
            <Entity>alter</Entity>
            <Copy>of type</Copy>
            <Type>{options.type}</Type>
            <Operator value={options.operator} />
            <Variable>{options.attribute}</Variable>
          </Fragment>
        );
      }
      return (
        <Fragment>
          <Entity>alter</Entity>
          <Copy>of type</Copy>
          <Type>{options.type}</Type>
          <Copy>with</Copy>
          <Variable>{options.attribute}</Variable>
          <Operator value={options.operator} />
          <Value value={options.value} />
        </Fragment>
      );
    }
    case 'edge':
      return (
        <Fragment>
          <Operator value={options.operator} />
          <Entity>edge</Entity>
          <Copy>of type</Copy>
          <Type>{options.type}</Type>
        </Fragment>
      );
    case 'ego':
      return (
        <Fragment>
          <Entity>ego</Entity>
          <Copy>has</Copy>
          <Variable>{options.attribute}</Variable>
          <Operator value={options.operator} />
          <Value value={options.value} />
        </Fragment>
      );
    default:
      return `Syntax for "${type}" is not defined`;
  }
};

export default PreviewText;
