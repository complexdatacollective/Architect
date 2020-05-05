import React from 'react';
import { Field } from 'redux-form';
import Select from '@components/Form/Fields/Select';
import ValidatedField from '@components/Form/ValidatedField';
import { Query, withStoreConnector, withFieldConnector, ruleValidator } from '@components/Query';
import Row from '@components/sections/Row';

const ConnectedQuery = withFieldConnector(withStoreConnector(Query));

const SkipLogicFields = () => (
  <React.Fragment>
    <Row>
      <h2>Show/Hide</h2>
      <ValidatedField
        className="form-fields-select--light-background"
        component={Select}
        name="skipLogic.action"
        options={[
          { value: 'SHOW', label: 'Show this stage if' },
          { value: 'SKIP', label: 'Skip this stage if' },
        ]}
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <Field
        component={ConnectedQuery}
        name="skipLogic.filter"
        validate={ruleValidator}
      />
    </Row>
  </React.Fragment>
);

export { SkipLogicFields };

export default SkipLogicFields;
