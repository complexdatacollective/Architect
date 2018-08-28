import React from 'react';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../../components/Form';
import SeamlessText from '../../../components/Form/Fields/SeamlessText';
import { getFieldId } from '../../../utils/issues';

const Name = () => (
  <Guidance contentId="guidance.editor.name">
    <div className="stage-editor-section">
      <div id={getFieldId('name')} />
      <h2 id="issue-label">Name</h2>
      <ValidatedField
        name="label"
        component={SeamlessText}
        placeholder="Enter your stage name here"
        className="stage-editor-section-title"
        validation={{ required: true }}
      />
    </div>
  </Guidance>
);

export default Name;
