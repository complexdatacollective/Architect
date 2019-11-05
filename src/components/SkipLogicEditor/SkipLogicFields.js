import React from 'react';
import { Field } from 'redux-form';
import Select from '@components/Form/Fields/Select';
import { Query, withStoreConnector, withFieldConnector, ruleValidator } from '@components/Query';

const ConnectedQuery = withFieldConnector(withStoreConnector(Query));

const SkipLogicEditor = () => (
  <div>
    <h1>Edit Skip Logic</h1>
    <div>
      <Field
        component={Select}
        name="action"
        options={[
          { value: 'SHOW', label: 'Show this stage if' },
          { value: 'SKIP', label: 'Skip this stage if' },
        ]}
      />
    </div>
    <div>
      <Field
        component={ConnectedQuery}
        name="filter"
        validate={ruleValidator}
      />
    </div>
  </div>
);

export { SkipLogicEditor };

export default SkipLogicEditor;
