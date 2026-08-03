import FieldError from '@components/Form/FieldError';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';
import { compose, defaultProps, withHandlers } from 'recompose';
import { FieldArray } from 'redux-form';

import { Button } from '@codaco/ui';

import Option from './Option';

const minTwoOptions = (value) =>
  !value || value.length < 2
    ? 'Requires a minimum of two options. If you need fewer options, consider using a boolean variable.'
    : undefined;

const AddItem = (props) => (
  <Button color="primary" icon="add" size="small" {...props}>
    Add new
  </Button>
);
const OptionsField = compose(
  defaultProps({
    lockAxis: 'y',
    useDragHandle: true,
  }),
  withHandlers({
    onSortEnd:
      ({ fields }) =>
      ({ oldIndex, newIndex }) =>
        fields.move(oldIndex, newIndex),
  }),
  SortableContainer,
)(({ fields, meta: { error, submitFailed }, ...rest }) => {
  const classes = cx('options', {
    'options--has-error': submitFailed && error,
  });

  return (
    <div className="form-field-container">
      <div className={classes}>
        <div className="options__options">
          {fields.map((field, index) => (
            <Option
              {...rest}
              key={field}
              index={index}
              field={field}
              fields={fields}
            />
          ))}
        </div>

        <FieldError show={submitFailed && error} error={error} />
      </div>
      <AddItem onClick={() => fields.push({})} />
    </div>
  );
});

OptionsField.propTypes = {
  fields: PropTypes.shape({
    map: PropTypes.func.isRequired,
  }).isRequired,
};

const Options = ({ name, ...rest }) => (
  <FieldArray
    name={name}
    component={OptionsField}
    validate={minTwoOptions}
    {...rest}
  />
);

Options.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

Options.defaultProps = {
  label: '',
};

export default Options;
