import React from 'react';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../../components/Form';
import SeamlessText from '../../../components/Form/Fields/SeamlessText';

const Name = () => (
  <Guidance contentId="guidance.editor.name">
    <div className="stage-editor-section">
      <h2>Name</h2>
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
