import React from 'react';
import { Field } from 'redux-form';
import Select from '@components/Form/Fields/Select';
import { Query, withStoreConnector, withFieldConnector, ruleValidator } from '@components/Query';

const ConnectedQuery = withFieldConnector(withStoreConnector(Query));

const SkipLogicFields = () => (
  <React.Fragment>
    <div className="stage-editor-section">
      <h2>Show/Hide</h2>
      <Field
        component={Select}
        name="skipLogic.action"
        options={[
          { value: 'SHOW', label: 'Show this stage if' },
          { value: 'SKIP', label: 'Skip this stage if' },
        ]}
      />
    </div>
    <div className="stage-editor-section">
      <Field
        component={ConnectedQuery}
        name="skipLogic.filter"
        validate={ruleValidator}
      />
    </div>
  </React.Fragment>
);

export { SkipLogicFields };

export default SkipLogicFields;
