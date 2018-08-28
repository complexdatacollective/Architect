import React from 'react';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../../components/Form';
import SeamlessText from '../../../components/Form/Fields/SeamlessText';
import { getFieldId } from '../../../utils/issues';

const Title = () => (
  <Guidance contentId="guidance.editor.title">
    <div className="stage-editor-section">
      <div id={getFieldId('title')} />
      <h2 id="title">Title</h2>
      <ValidatedField
        name="title"
        component={SeamlessText}
        placeholder="Enter your title here"
        className="stage-editor-section-title"
        validation={{ required: true }}
      />
    </div>
  </Guidance>
);

export default Title;
