import useValidate from '@app/hooks/useValidate';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import IssueAnchor from '../IssueAnchor';

const ValidatedField = ({
  name,
  label,
  issueDescription,
  validation,
  ...rest
}) => {
  const validations = useValidate(validation);

  return (
    <IssueAnchor
      fieldName={name}
      description={issueDescription || `Field: ${label}` || `Field: ${name}`}
    >
      <Field name={name} label={label} {...rest} validate={validations} />
    </IssueAnchor>
  );
};

ValidatedField.defaultProps = {
  issueDescription: null,
  label: null,
};

ValidatedField.propTypes = {
  validation: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  issueDescription: PropTypes.string,
  label: PropTypes.string,
};

export default ValidatedField;
