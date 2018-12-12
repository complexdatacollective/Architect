import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

export const Join = ({ value }) => (<div className="rules-rule-text__join">{ value }</div>);
Join.propTypes = { value: PropTypes.string.isRequired };

const Type = ({ value }) => (<div className="rules-rule-text__type">{value}</div>);
Type.propTypes = { value: PropTypes.string };
Type.defaultProps = { value: '' };

const Entity = ({ value }) => (<div className="rules-rule-text__entity">{value}</div>);
Entity.propTypes = { value: PropTypes.string };
Entity.defaultProps = { value: '' };

const Operator = ({ value }) => (<div className="rules-rule-text__operator">{value}</div>);
Operator.propTypes = { value: PropTypes.string };
Operator.defaultProps = { value: '' };

const Variable = ({ value }) => (<div className="rules-rule-text__variable">{value}</div>);
Variable.propTypes = { value: PropTypes.string };
Variable.defaultProps = { value: '' };

const Value = ({ value }) => (<div className="rules-rule-text__value">{value}</div>);
Value.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};
Value.defaultProps = { value: '' };

const Rule = ({ type, options }) => {
  switch (type) {
    case 'alter': {
      if (!options.variable) {
        return (
          <Fragment>
            <Entity value="alter" /> of type <Type value={options.value} />
          </Fragment>
        );
      }
      return (
        <Fragment>
          <Entity value="alter" /> of type <Type value={options.value} />
          with
          <Variable value={options.variable} />
          <Operator value={options.operator} />
          <Value value={options.value} />
        </Fragment>
      );
    }
    case 'edge':
      return (
        <Fragment>
          has <Entity value="edge" /> of type <Type value={options.value} />
        </Fragment>
      );
    default:
      return '';
  }
};

export default Rule;
