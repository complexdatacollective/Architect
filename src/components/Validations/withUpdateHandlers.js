import { omit } from 'lodash';
import { withHandlers } from 'recompose';
import { isValidationWithValue } from './options';

const getUpdatedValue = (previousValue, key, value, oldKey = null) => {
  const autoValue = isValidationWithValue(key) ?
    value :
    true;

  if (!oldKey) { return { ...previousValue, [key]: autoValue }; }

  return {
    ...omit(previousValue, oldKey),
    [key]: autoValue,
  };
};

const withUpdateHandlers = withHandlers({
  handleDelete: ({ openDialog, update, value: previousValue }) =>
    (key) => {
      const newValue = omit(previousValue, key);

      openDialog({
        type: 'Warning',
        title: 'Remove validation',
        message: 'Are you sure you want to remove this rule?',
        onConfirm: () => { update(newValue); },
        confirmLabel: 'Remove validation',
      });
    },
  handleChange: ({ update, value: previousValue }) =>
    (key, value, oldKey) => {
      const newValue = getUpdatedValue(previousValue, key, value, oldKey);
      update(newValue);
    },
  handleAddNew: ({ update, value: previousValue, setAddNew }) =>
    (key, value) => {
      const newValue = getUpdatedValue(previousValue, key, value);
      update(newValue);
      setAddNew(false);
    },
});

export default withUpdateHandlers;
