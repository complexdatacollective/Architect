import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { get, noop } from 'lodash';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';
import { getValidator } from '@app/utils/validations';

const makeGetValidationErrors = (validation = {}, reserved = []) =>
  (options, option) => {
    const validator = getValidator(validation);
    const validationErrors = validator(option);

    // True if option contains only spaces or no chars
    const isEmpty = option.replace(/ /g, '').length === 0;

    // True if option matches the label prop of the supplied object
    const matchLabel = ({ label: variableLabel }) =>
      variableLabel && option &&
      variableLabel.toLowerCase() === option.toLowerCase();
    const alreadyExists = options.some(matchLabel);
    const isReserved = reserved.some(matchLabel);

    let warnings = null;

    if (!alreadyExists && isReserved) {
      warnings = `"${option}" is already used elsewhere in this entity`;
    } else if (!isEmpty && validationErrors) {
      warnings = validationErrors;
    }

    const isValid = !isEmpty && !validationErrors && !alreadyExists && !isReserved;

    return [isValid, warnings];
  };

const initialState = {
  isNew: false,
  isNewSaved: false,
  newValue: '',
  value: null,
  isNewValid: false,
  newWarnings: null,
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
  validation,
  reserved,
  ...props
}) => {
  const { value } = input;
  const { invalid, error, touched } = meta;
  const onChange = input.onChange || props.onChange;

  const [state, setState] = useState({
    ...initialState,
  });

  const getValidationErrors = makeGetValidationErrors(validation, reserved);

  const handleSelect = (e) => {
    const index = e.target.value;
    // Redux form value handler needs the actual value
    const valuePath = input.onChange ? [index, 'value'] : index;
    const updatedValue = get(options, valuePath, null);
    setState(s => ({ ...s, isNew: false }));
    onChange(updatedValue);
  };

  const handleChooseCreateNew = () => {
    onChange(null);
    setState(s => ({ ...s, isNew: true, newValue: '', isNewValid: false, newWarnings: null }));
  };

  const handleChangeNew = (e) => {
    const newValue = e.target.value;
    const [isNewValid, newWarnings] = getValidationErrors(options, newValue);
    setState(s => ({ ...s, newValue, isNewValid, newWarnings }));
  };

  const handleSaveNew = () => {
    if (!state.isNewValid) { return; }
    const result = onCreateOption(state.newValue);
    setState(s => ({ ...s, isNewSaved: true }));
    onChange(result);
  };

  const handleCancelNew = () => {
    setState(s => ({ ...s, isNew: false, isNewValid: false, newWarnings: null }));
  };

  const handleDeleteNew = () => {
    onDeleteOption(value);
    setState(s => ({ ...s, isNewSaved: false, isNew: false }));
    onChange(null);
  };

  const selected = options.findIndex(option => option.value === value);
  const selectDisabled = disabled || state.isNew;
  const classes = cx(
    className,
    'chooser',
    {
      'chooser--has-error': invalid && touched && error,
    },
  );

  return (
    <motion.div className={classes}>
      <AnimatePresence>
        <motion.div key="options">
          <select
            onChange={handleSelect}
            value={selected}
            disabled={selectDisabled}
            className="chooser__select"
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
            className="chooser__new"
          >
            <input
              type="text"
              value={state.newValue}
              onChange={handleChangeNew}
              disabled={state.isNewSaved}
              className="chooser__text"
            />
            { !state.isNewSaved &&
              <Fragment>
                <button type="button" onClick={handleSaveNew} disabled={!state.isNewValid}>Save</button>
                <button type="button" onClick={handleCancelNew}>Cancel</button>
              </Fragment>
            }
          </motion.div>
        }
        { state.newWarnings &&
          <motion.div className="form-fields-select__error"><Icon name="warning" />{state.newWarnings}</motion.div>
        }
        { invalid && touched &&
          <motion.div className="form-fields-select__error"><Icon name="warning" />{error}</motion.div>
        }
      </AnimatePresence>
    </motion.div>
  );
};

Select.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes
    .shape({ onChange: PropTypes.func, value: PropTypes.any }),
  label: PropTypes.string,
  meta: PropTypes
    .shape({ invalid: PropTypes.bool, error: PropTypes.string, touched: PropTypes.bool }),
  onChange: PropTypes.func,
  onCreateOption: PropTypes.func,
  onDeleteOption: PropTypes.funx,
  options: PropTypes.array,
  reserved: PropTypes.array,
  validation: PropTypes.object,
};

Select.defaultProps = {
  className: null,
  disabled: false,
  input: { value: null, onChange: noop },
  label: null,
  meta: { invalid: false, touched: false, error: null },
  onChange: noop,
  onCreateOption: noop,
  onDeleteOption: noop,
  options: [],
  reserved: [],
  validation: {},
};


export default Select;
