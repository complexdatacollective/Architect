import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Field,
  isDirty as isFieldDirty,
  FormSection,
  formValueSelector,
} from 'redux-form';
import Guidance from '../Guidance';
import { ValidatedField } from '../Form';
import * as Fields from '../../ui/components/Fields';
import * as ArchitectFields from '../Form/Fields';
import Validations from './Validations';
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
  form,
  variableType,
  ...rest
}) => (
  <ExpandableItem
    open={isDirty}
    preview={(
      <FormSection name={fieldId}>
        <h3 className="variable__preview-title">
          <Field
            name="name"
            component={({ input: { value } }) => value || 'undefined'}
          />
          &nbsp;:&nbsp;
          <em>
            <Field
              name="type"
              component={({ input: { value } }) => value || 'undefined'}
            />
          </em>
        </h3>
        <p className="variable__preview-description">
          <Field
            name="description"
            component={({ input: { value } }) => value}
          />
        </p>
      </FormSection>
    )}
    {...rest}
  >
    <FormSection name={fieldId}>
      <Guidance contentId="guidance.registry.variable">
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

          <Validations
            name="validation"
            label="Validations"
            variableType={variableType}
            meta={{ form }}
          />
        </div>
      </Guidance>
    </FormSection>
  </ExpandableItem>
);

Variable.propTypes = {
  fieldId: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  isDirty: PropTypes.bool,
  variableType: PropTypes.string,
};

Variable.defaultProps = {
  isDirty: false,
  variableType: null,
};

const mapStateToProps = (state, { form, fieldId }) => ({
  isDirty: isFieldDirty(form)(state, fieldId),
  variableType: formValueSelector(form)(state, `${fieldId}.type`),
});

export { Variable };

export default connect(mapStateToProps)(Variable);
