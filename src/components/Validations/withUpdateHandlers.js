import { omit } from 'lodash';
import { withHandlers } from 'recompose';
import { isValidationWithListValue, isValidationWithNumberValue } from './options';

/**
 * Function called when a validation is added or updated. Returns a value
 * based on the validation type, and the previous value (if any).
 *
 * @param {string} type - The validation type.
 * @param {string} oldType - The previous validation type.
 * @param {string} value - The current value.
 * @returns {string} The new value.
 */
const getAutoValue = (type, oldType, value) => {
  // Required is special - always return true.
  if (type === 'required') {
    return true;
  }

  // If the new type and the old type are both numbers, keep the value
  if (isValidationWithNumberValue(type) && isValidationWithNumberValue(oldType)) {
    return value;
  }

  // If the new type and the old type both reference variables, keep the value.
  if (isValidationWithListValue(type) && isValidationWithListValue(oldType)) {
    return value;
  }

  // Otherwise, set an empty value to force the user to enter a value.
  return null;
};

const getUpdatedValue = (previousValue, key, value, oldKey = null) => {
  const autoValue = getAutoValue(key, oldKey, value);

  if (!oldKey) { return { ...previousValue, [key]: autoValue }; }

  return {
    ...omit(previousValue, oldKey),
    [key]: autoValue,
  };
};

const withUpdateHandlers = withHandlers({
  handleDelete: ({ openDialog, update, value: previousValue }) => (key) => {
    const newValue = omit(previousValue, key);

    openDialog({
      type: 'Warning',
      title: 'Remove validation',
      message: 'Are you sure you want to remove this rule?',
      onConfirm: () => { update(newValue); },
      confirmLabel: 'Remove validation',
    });
  },
  handleChange: ({ update, value: previousValue }) => (key, value, oldKey) => {
    const newValue = getUpdatedValue(previousValue, key, value, oldKey);
    update(newValue);
  },
  handleAddNew: ({ update, value: previousValue, setAddNew }) => (key, value) => {
    const newValue = getUpdatedValue(previousValue, key, value);
    update(newValue);
    setAddNew(false);
  },
});

export default withUpdateHandlers;
