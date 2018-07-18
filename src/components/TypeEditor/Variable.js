import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, clearFields, isDirty as isFieldDirty, FormSection } from 'redux-form';
import Guidance from '../Guidance';
import { ValidatedField } from '../Form';
import * as Fields from '../../ui/components/Fields';
import * as ArchitectFields from '../Form/Fields';
import ExpandableItem from '../Items/ExpandableItem';

const VARIABLE_TYPES = [
  'text',
  'number',
  'datetime',
  'boolean',
  'ordinal',
  'catagorical',
  'layout',
  'location',
];

const Variable = ({
  fieldId,
  isDirty,
  ...rest
}) => (
  <ExpandableItem
    open={isDirty}
    preview={(
      <FormSection name={fieldId}>
        <h3>
          <Field
            name="name"
            component={({ input: { value } }) => value}
          />
          :
          <Field
            name="type"
            component={({ input: { value } }) => value}
          />
        </h3>
      </FormSection>
    )}
    {...rest}
  >
    <FormSection name={fieldId}>
      <Guidance contentId="guidance.registry.variable.name">
        <div>
          <ValidatedField
            name="name"
            component={Fields.Text}
            label="Variable name"
            validation={{ required: true }}
          />
          <Field
            name="description"
            component={Fields.Text}
            label="Description"
          />
          <ValidatedField
            name="type"
            component={ArchitectFields.Select}
            label="Variable type"
            options={VARIABLE_TYPES}
            validation={{ required: true }}
          >
            <option value="">&mdash; Select variable type &mdash;</option>
          </ValidatedField>
        </div>
      </Guidance>
    </FormSection>
  </ExpandableItem>
);

Variable.propTypes = {
  fieldId: PropTypes.string.isRequired,
  isDirty: PropTypes.bool,
};

Variable.defaultProps = {
  isDirty: false,
};

const mapStateToProps = (state, props) => ({
  isDirty: isFieldDirty(props.form)(state, props.fieldId),
});

const mapDispatchToProps = (dispatch, props) => ({
  clearField: (fieldName) => {
    dispatch(clearFields(props.form.name, false, false, fieldName));
  },
});

export { Variable };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  Variable,
);
