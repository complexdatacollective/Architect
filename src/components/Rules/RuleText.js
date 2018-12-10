import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Type = ({ value }) => (<div className="type">{value}</div>);
Type.propTypes = { value: PropTypes.string };
Type.defaultProps = { value: '' };

const Entity = ({ value }) => (<div className="entity">{value}</div>);
Entity.propTypes = { value: PropTypes.string };
Entity.defaultProps = { value: '' };

const Operator = ({ value }) => (<div className="operator">{value}</div>);
Operator.propTypes = { value: PropTypes.string };
Operator.defaultProps = { value: '' };

const Variable = ({ value }) => (<div className="variable">{value}</div>);
Variable.propTypes = { value: PropTypes.string };
Variable.defaultProps = { value: '' };

const Value = ({ value }) => (<div className="value">{value}</div>);
Value.propTypes = { value: PropTypes.string };
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
