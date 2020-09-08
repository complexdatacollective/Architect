import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { get } from 'lodash';
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
  createNewOption,
  meta,
  ...rest,
}) => {
  const { value, onChange } = input;
  const { invalid, error, touched } = meta;

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

  const handleClickCreateNew = () => {
    setState(s => ({ ...s, isNew: true }));
  };

  const handleSelect = (e) => {
    const index = e.target.value;
    const updatedValue = get(options, [index, 'value'], null);
    setState(s => ({ ...s, isNew: false }));
    onChange(updatedValue);
  };

  const handleChangeNew = (e) => {
    const newValue = e.target.value;
    setState(s => ({ ...s, newValue }));
  };

  // useEffect(() => {
  //   if (state.value !== input.value) { return; }
  //   setState(s => ({ ...s, value }));
  // }, [input.value]);

  // useEffect(() => {
  //   if (state.value !== input.value) { return; }

  //   if (onChange) {
  //     onChange(state.value);
  //     console.log(input, state);
  //   }
  //   console.log(input, state);
  // }, [state.value]);

  return (
    <motion.div className={classes}>
      <AnimatePresence>
        <motion.div key="options">
          <select onChange={handleSelect} value={selected}>
            <option>&mdash; Select an option &mdash;</option>
            {options.map((option, index) => (
              <option
                value={index}
                key={`option_${index}`}
              >{option.label || option.value}</option>
            ))}
          </select>
          { createNewOption &&
            <button
              onClick={handleClickCreateNew}
            >Create new</button>
          }
        </motion.div>
        { state.isNew &&
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
            { !state.isNewSaved && <button>Save</button> }
            { state.isNewSaved && <button>Delete</button> }
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
};

Select.defaultProps = {
  className: null,
  options: [],
  meta: {},
  input: {},
};


export default Select;
