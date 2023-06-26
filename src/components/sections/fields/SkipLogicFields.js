import React from 'react';
import RadioGroup from '@codaco/ui/lib/components/Fields/RadioGroup';
import ValidatedField from '@components/Form/ValidatedField';
import {
  Query, withStoreConnector, withFieldConnector, ruleValidator,
} from '@components/Query';
import { Row } from '@components/EditorLayout';
import { getFieldId } from '../../../utils/issues';
import IssueAnchor from '../../IssueAnchor';

const ConnectedQuery = withFieldConnector(withStoreConnector(Query));
const SkipLogicFields = () => (
  <>
    <Row>
      <IssueAnchor fieldName={getFieldId('skipLogic.action')} description="Skip Logic Action" />
      <ValidatedField
        className="form-fields-select"
        component={RadioGroup}
        name="skipLogic.action"
        options={[
          { value: 'SHOW', label: 'Show this stage if' },
          { value: 'SKIP', label: 'Skip this stage if' },
        ]}
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <IssueAnchor fieldName={getFieldId('skipLogic.filter')} description="Skip Logic Rules" />
      <ValidatedField
        component={ConnectedQuery}
        name="skipLogic.filter"
        validation={{ required: true, validator: ruleValidator }}
      />
    </Row>
  </>
);

export default SkipLogicFields;
