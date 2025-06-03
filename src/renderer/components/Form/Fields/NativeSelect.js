import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '@codaco/ui/lib/components/Icon';
import { getValidator } from '@app/utils/validations';
import { Text } from '@codaco/ui/lib/components/Fields';
import { Button } from '@codaco/ui';
import { sortBy } from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';
import { untouch } from 'redux-form';
import { useDispatch } from 'react-redux';

const NativeSelect = ({
  label,
  options,
  placeholder,
  className,
  // To create a new option, one or the other of the following:
  onCreateOption, // Creating options inline, receives value for option (promise)
  onCreateNew, // Call a function immediately (typically opening a window with a form)
  createLabelText,
  createInputLabel,
  createInputPlaceholder,
  allowPlaceholderSelect,
  sortOptionsByLabel,
  reserved,
  validation,
  disabled,
  input: { onBlur, ...input },
  meta: {
    invalid, error, touched, form,
  },
  ...rest
}) => {
  const [showCreateOptionForm, setShowCreateOptionForm] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState(null);
  const [newOptionError, setNewOptionError] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (option) => {
    if (option.target.value === '_create') {
      input.onChange(null);

      // Setting input to null above will 'touch' the select, triggering validation
      // which we don't want yet. We 'un-touch' the input to resolve this.
      dispatch(untouch(form, input.name));
      if (onCreateNew) {
        onCreateNew();
        return;
      }

      setShowCreateOptionForm(true);
      return;
    }

    if (option.target.value === '_placeholder') {
      input.onChange(null);
      return;
    }

    input.onChange(option.target.value);
  };

  const resetForm = () => {
    setShowCreateOptionForm(false);
    setNewOptionValue(null);
    setNewOptionError(false);
  };

  const handleCreateOption = () => {
    const newValue = newOptionValue;

    resetForm();

    return onCreateOption(newValue);
  };

  const isValidCreateOption = () => {
    const validationErrors = getValidator(validation)(newOptionValue);

    if (validationErrors) {
      setNewOptionError(validationErrors);
      return false;
    }

    // True if option matches the label prop of the supplied object
    const matchLabel = ({ label: variableLabel }) => variableLabel && newOptionValue
      && variableLabel.toLowerCase() === newOptionValue.toLowerCase();

    const alreadyExists = options.some(matchLabel);
    const isReserved = reserved.some(matchLabel);

    if (alreadyExists || isReserved) {
      setNewOptionError(`Variable name "${newOptionValue}" is already defined on entity type ${rest.entity}`);
      return false;
    }

    setNewOptionError(false);
    return true;
  };

  // Do we have a value in the create new Text field that is not submitted?
  const valueButNotSubmitted = newOptionValue !== null && showCreateOptionForm;

  const notSubmittedError = useMemo(() => valueButNotSubmitted && 'You must click "create" to finish creating this variable.', [valueButNotSubmitted]);

  /**
   * This passes through validation errors from the select to the Text field for
   * creating new options. It also has to handle when the create new option form
   * hasn't been shown
   *
   * touched:
   *   - touched: controlled by parent input, and triggered/reset from child as needed
   *   - new option isn't null (prevents "required" immediately showing) AND new option
   *     isn't valid. Combined this allows the correct error to be shown.
   * invalid:
   *   - !isValidCreateOption: validate the new variable Text field value
   *   - valueButNotSubmitted: true if value entered in Text field but not submitted
   *   - invalid: parent select invalid prop. Will be set to true when validation is
   *     triggered and we have no value set
   * error:
   *   - newOptionError: error message from Text field variable validation
   *   - error: parent select error message. Will usually be "Required"
   */

  const calculateMeta = useMemo(() => ({
    touched: touched || (newOptionValue !== null && !isValidCreateOption(newOptionValue)),
    invalid: (
      !isValidCreateOption(newOptionValue)
      || valueButNotSubmitted
      || (newOptionValue === null && invalid)
    ),
    localInvalid: !isValidCreateOption(newOptionValue),
    error: newOptionError || notSubmittedError || error,
  }), [
    touched,
    invalid,
    error,
    newOptionValue,
    newOptionError,
    valueButNotSubmitted,
    notSubmittedError,
  ]);

  const sortedOptions = useMemo(() => (sortOptionsByLabel ? sortBy(options, 'label') : options), [options, sortOptionsByLabel]);

  const variants = {
    show: { opacity: 1 },
    hide: { opacity: 0 },
    transition: { duration: 0.5 },
  };

  const componentClasses = cx(
    className,
    'form-fields-select-native',
    {
      'form-fields-select-native--has-error': invalid && touched && error,
      'form-fields-select-native--disabled': disabled,
    },
  );

  return (
    <motion.div className="form-fields-select-native__wrapper">
      <AnimatePresence initial={false} exitBeforeEnter>
        { showCreateOptionForm ? (
          <motion.div className="form-fields-select-native__new-section" key="new-section" variants={variants} initial="hide" exit="hide" animate="show">
            <Text
              label={createInputLabel}
              autoFocus
              input={{
                // Make interaction with this input also touch the parent so we can control
                // validation better.
                onChange: (event) => {
                  dispatch(untouch(form, input.name));
                  setNewOptionValue(event.target.value);
                },
              }}
              placeholder={createInputPlaceholder}
              meta={calculateMeta}
            />
            <div className="button-footer">
              <Button color="platinum" onClick={() => setShowCreateOptionForm(false)}>Cancel</Button>
              <Button
                onClick={handleCreateOption}
                disabled={calculateMeta.localInvalid}
              >
                Create
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="select-section" className={componentClasses} initial="hide" variants={variants} exit="hide" animate="show">
            { label
              && <h4>{label}</h4>}
            <select
              className="form-fields-select-native__component"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...input}
              value={input.value || '_placeholder'}
              onChange={handleChange}
              validation={validation}
              disabled={!!disabled}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...rest}
            >
              <option disabled={!allowPlaceholderSelect} value="_placeholder">
                --
                {' '}
                {placeholder}
                {' '}
                --
              </option>
              { (onCreateOption || onCreateNew) && <option value="_create">{createLabelText}</option>}
              { sortedOptions.map((option) => (
                <option
                  key={`${option.label}_${option.value}`}
                  value={option.value}
                  disabled={!!option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {invalid && touched && (
            <div className="form-fields-select-native__error">
              <Icon name="warning" />
              {error}
            </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

NativeSelect.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  createLabelText: PropTypes.string,
  createInputLabel: PropTypes.string,
  createInputPlaceholder: PropTypes.string,
  allowPlaceholderSelect: PropTypes.bool,
  sortOptionsByLabel: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.array,
  // eslint-disable-next-line react/forbid-prop-types
  input: PropTypes.object,
  label: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object,
  disabled: PropTypes.bool,
  onCreateOption: PropTypes.func,
  onCreateNew: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  reserved: PropTypes.array,
  // eslint-disable-next-line react/forbid-prop-types
  validation: PropTypes.any,
};

NativeSelect.defaultProps = {
  className: '',
  placeholder: 'Select an option',
  createLabelText: '✨ Create new ✨',
  createInputLabel: 'New variable name',
  createInputPlaceholder: 'Enter a variable name...',
  allowPlaceholderSelect: false,
  sortOptionsByLabel: true,
  options: [],
  input: { value: '' },
  label: null,
  disabled: false,
  meta: { invalid: false, error: null, touched: false },
  onCreateOption: null,
  onCreateNew: null,
  reserved: [],
  validation: null,
};

export default NativeSelect;
