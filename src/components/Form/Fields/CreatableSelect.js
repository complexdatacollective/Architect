import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { get, noop } from 'lodash';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';
import Text from '@codaco/ui/lib/components/Fields/Text';

const initialState = {
  isNew: false,
  isNewSaved: false,
  newValue: null,
  value: null,
};

const Select = ({
  className,
  input,
  options,
  label,
  onCreateOption,
  onDeleteOption,
  disabled,
  meta,
  ...props,
}) => {
  const { value } = input;
  const { invalid, error, touched } = meta;

  const onChange = input.onChange || props.onChange;

  const [state, setState] = useState({
    ...initialState,
  });

  const selected = options.findIndex(option => option.value === value);

  const classes = cx(
    className,
    'chooser',
    {
      'chooser--has-error': invalid && touched && error,
    },
  );

  const handleSaveNew = () => {
    const result = onCreateOption(state.newValue);
    setState(s => ({ ...s, isNewSaved: true }));
    onChange(result);
  };

  const handleChooseCreateNew = () => {
    setState(s => ({ ...s, isNew: true, newValue: '' }));
  };

  const handleDeleteNew = () => {
    onDeleteOption(value);
    setState(s => ({ ...s, isNewSaved: false, isNew: false }));
    onChange(null);
  };

  const handleSelect = (e) => {
    const index = e.target.value;
    // Redux form value handler needs the actual value
    const valuePath = input.onChange ? [index, 'value'] : index;
    const updatedValue = get(options, valuePath, null);
    setState(s => ({ ...s, isNew: false }));
    onChange(updatedValue);
  };

  const handleChangeNew = (e) => {
    const newValue = e.target.value;
    setState(s => ({ ...s, newValue }));
  };

  const handleCancelNew = () => {
    setState(s => ({ ...s, isNew: false }));
  };

  const selectDisabled = disabled || state.isNew;

  return (
    <motion.div className={classes}>
      <AnimatePresence>
        <motion.div key="options">
          <select
            onChange={handleSelect}
            value={selected}
            disabled={selectDisabled}
          >
            <option>&mdash; Select an option &mdash;</option>
            {options.map((option, index) => (
              <option
                value={index}
                key={`option_${index}`}
              >{option.label || option.value}</option>
            ))}
          </select>
          { !state.isNew &&
            <button
              onClick={handleChooseCreateNew}
              type="button"
              disabled={selectDisabled}
            >Create new</button>
          }
          { state.isNewSaved &&
            <button type="button" onClick={handleDeleteNew}>Delete</button> }
        </motion.div>
        { state.isNew && !state.isNewSaved &&
          <motion.div
            key="new"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <input
              type="text"
              value={state.newValue}
              onChange={handleChangeNew}
              disabled={state.isNewSaved}
            />
            { !state.isNewSaved &&
              <Fragment>
                <button type="button" onClick={handleSaveNew}>Save</button>
                <button type="button" onClick={handleCancelNew}>Cancel</button>
              </Fragment>
            }
          </motion.div>
        }
        <motion.div key="error">
          {invalid && touched && <div className="form-fields-select__error"><Icon name="warning" />{error}</div>}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

Select.propTypes = {
  options: PropTypes.array,
  className: PropTypes.string,
  input: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.any,
  }),
  meta: PropTypes.shape({
    invalid: PropTypes.bool,
    error: PropTypes.string,
    touched: PropTypes.bool,
  }),
};

Select.defaultProps = {
  className: null,
  options: [],
  meta: {
    invalid: false,
    touched: false,
    error: null,
  },
  input: {
    value: null,
    onChange: noop,
  },
};


export default Select;
