import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, clearFields, isDirty, FormSection, formValueSelector } from 'redux-form';
import { keys, get, toPairs, isEmpty } from 'lodash';
import Guidance from '../Guidance';
import { ValidatedField } from '../Form';
import * as ArchitectFields from '../Form/Fields';
import * as Fields from '../../ui/components/Fields';
import ExpandableItem from '../StageEditor/Sortable/ExpandableItem';

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
        <div>
          Preview
        </div>
      </FormSection>
    )}
    {...rest}
  >
    <FormSection name={fieldId}>
      <div className="stage-editor-section-prompt__group">
        <ValidatedField
          name="text"
          component={Fields.TextArea}
          className="stage-editor-section-prompt__setting"
          label="Text for prompt"
          placeholder="Enter text for the prompt here"
          validation={{ required: true }}
        />
      </div>
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

const mapStateToProps = (state, props) => {
  const getValue = formValueSelector(props.form);
  const isFieldDirty = isDirty(props.form);

  return {
    isDirty: isFieldDirty(state, props.fieldId),
  };
};

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
