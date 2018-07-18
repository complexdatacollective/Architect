import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, clearFields, isDirty as isFieldDirty, FormSection } from 'redux-form';
import Guidance from '../Guidance';
import { ValidatedField } from '../Form';
import * as Fields from '../../ui/components/Fields';
import ExpandableItem from '../Items/ExpandableItem';

const Variable = ({
  fieldId,
  isDirty,
  ...rest
}) => (
  <ExpandableItem
    className="stage-editor-section-sociogram-prompt"
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
        <div className="stage-editor-section-prompt__group">
          <ValidatedField
            name="name"
            component={Fields.Text}
            className="stage-editor-section-prompt__setting"
            label="Variable name"
            validation={{ required: true }}
          />
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
