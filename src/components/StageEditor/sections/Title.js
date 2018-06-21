import React from 'react';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../../components/Form';
import SeamlessText from '../../../components/Form/Fields/SeamlessText';

const Title = () => (
  <Guidance contentId="guidance.editor.title">
    <div className="stage-editor-section">
      <h2>Title</h2>
      <ValidatedField
        name="label"
        component={SeamlessText}
        placeholder="Enter your title here"
        className="stage-editor-section-title"
        validation={{ required: true }}
      />
    </div>
  </Guidance>
);

export default Title;
