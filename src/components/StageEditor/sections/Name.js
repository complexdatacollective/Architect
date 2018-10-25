import React from 'react';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../../components/Form';
import SeamlessText from '../../../components/Form/Fields/SeamlessText';
import { getFieldId } from '../../../utils/issues';

const Name = () => (
  <Guidance contentId="guidance.editor.name">
    <div className="stage-editor-section">
      <div id={getFieldId('label')} data-name="Stage name" />
      <h2>Name</h2>
      <p>
        Enter a name for your stage here. This name will appear in the timeline view of your
        protocol in both Architect and Network Canvas
      </p>
      <ValidatedField
        name="label"
        component={SeamlessText}
        placeholder="Enter your stage name here"
        className="stage-editor-section-title"
        maxLength="50"
        validation={{ required: true }}
      />
    </div>
  </Guidance>
);

export default Name;
