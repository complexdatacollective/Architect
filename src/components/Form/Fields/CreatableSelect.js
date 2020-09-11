import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import { get, noop } from 'lodash';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';
import Button from '@codaco/ui/lib/components/Button';
import { getValidator } from '@app/utils/validations';

const animationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

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

  const selectInput = useRef();

  const [state, setState] = useState({
    ...initialState,
  });

  useEffect(() => {
    if (!state.isNew && selectInput.current) {
      selectInput.current.focus();
    }
  }, [state.isNew]);

  const getValidationErrors = makeGetValidationErrors(validation, reserved);

  const handleSelect = (e) => {
    const index = e.target.value;
    // Redux form value handler needs the actual value, but the onChange prop uses the index...
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

  const handleCheckSubmit = (e) => {
    const keycode = e.keyCode || e.which;
    if (keycode !== 13) { return; }
    handleSaveNew();
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
      <AnimateSharedLayout>
        { !state.isNew &&
          <motion.div
            key="options"
            className="chooser__section"
            initial={animationVariants.initial}
            animate={animationVariants.animate}
            exit={animationVariants.exit}
          >
            <select
              onChange={handleSelect}
              value={selected}
              disabled={selectDisabled}
              className="chooser__select"
              ref={selectInput}
            >
              <option>&mdash; Select an option &mdash;</option>
              {options.map((option, index) => (
                <option
                  value={index}
                  key={`option_${index}`}
                >{option.label || option.value}</option>
              ))}
            </select>
            <div className="chooser__section-controls">
              <Button
                size="small"
                onClick={handleChooseCreateNew}
                disabled={selectDisabled}
              >Create new</Button>
            </div>
          </motion.div>
        }
        { state.isNew &&
          <motion.div
            key="new"
            className="chooser__section"
            initial={animationVariants.initial}
            animate={animationVariants.animate}
            exit={animationVariants.exit}
          >
            <input
              type="text"
              value={state.newValue}
              onChange={handleChangeNew}
              onKeyUp={handleCheckSubmit}
              disabled={state.isNewSaved}
              className="chooser__text"
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            />
            <motion.div className="chooser__section-controls">
              <AnimateSharedLayout>
                { !state.isNewSaved &&
                  <motion.div
                    key="save"
                    initial={animationVariants.initial}
                    animate={animationVariants.animate}
                    exit={animationVariants.exit}
                  >
                    <Button size="small" onClick={handleSaveNew} disabled={!state.isNewValid}>
                      Save
                    </Button>
                    <Button size="small" onClick={handleCancelNew} color="platinum">
                      Cancel
                    </Button>
                  </motion.div>
                }
                { state.isNewSaved &&
                  <motion.div
                    key="delete"
                    initial={animationVariants.initial}
                    animate={animationVariants.animate}
                    exit={animationVariants.exit}
                  >
                    <Button
                      size="small"
                      onClick={handleDeleteNew}
                      color="platinum"
                    >Delete</Button>
                  </motion.div>
                }
              </AnimateSharedLayout>
            </motion.div>
          </motion.div>
        }
        { state.newWarnings &&
          <motion.div className="form-fields-select__error"><Icon name="warning" />{state.newWarnings}</motion.div>
        }
        { invalid && touched &&
          <motion.div className="form-fields-select__error"><Icon name="warning" />{error}</motion.div>
        }
      </AnimateSharedLayout>
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
