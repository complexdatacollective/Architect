import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const formatValue = (value) => {
  switch (typeof value) {
    case 'boolean':
      return value ? 'true' : 'false';
    default:
      return value;
  }
};

export const Join = ({ value }) => (<div className="rules-rule-text__join">{ value.toLowerCase() }</div>);
Join.propTypes = { value: PropTypes.string };
Join.defaultProps = { value: '' };

const Type = ({ children }) => (<div className="rules-rule-text__type">{children}</div>);
Type.propTypes = { children: PropTypes.node };
Type.defaultProps = { children: '' };

const Entity = ({ children }) => (<div className="rules-rule-text__entity">{children}</div>);
Entity.propTypes = { children: PropTypes.node };
Entity.defaultProps = { children: '' };

const Variable = ({ children }) => (<div className="rules-rule-text__variable">{children}</div>);
Variable.propTypes = { children: PropTypes.node };
Variable.defaultProps = { children: '' };

const Operator = ({ value }) => (<div className="rules-rule-text__operator">{value.toLowerCase()}</div>);
Operator.propTypes = { value: PropTypes.string };
Operator.defaultProps = { value: '' };

const Value = ({ value }) => {
  const formattedValue = formatValue(value);
  return (
    <div className="rules-rule-text__value">{formattedValue}</div>
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

const Copy = ({ children }) => (<div className="rules-rule-text__connector">{children}</div>);
Copy.propTypes = { children: PropTypes.string };
Copy.defaultProps = { children: '' };

const Rule = ({ type, options }) => {
  switch (type) {
    case 'alter': {
      if (!options.variable) {
        return (
          <Fragment>
            <Entity>alter</Entity>
            <Copy>of type</Copy>
            <Type>{options.type}</Type>
            <Operator value={options.operator} />
          </Fragment>
        );
      }
      return (
        <Fragment>
          <Entity>alter</Entity>
          <Copy>of type</Copy>
          <Type>{options.type}</Type>
          <Copy>with</Copy>
          <Variable>{options.variable}</Variable>
          <Operator value={options.operator} />
          <Value value={options.value} />
        </Fragment>
      );
    }
    case 'edge':
      return (
        <Fragment>
          <Entity>edge</Entity>
          <Copy>of type</Copy>
          <Type>{options.type}</Type>
          <Operator value={options.operator} />
        </Fragment>
      );
    default:
      return '';
  }
};

export default Rule;
