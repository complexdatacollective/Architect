import React from 'react';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../../components/Form';
import * as Fields from '../../../ui/components/Fields';
import { getFieldId } from '../../../utils/issues';

const Title = () => (
  <Guidance contentId="guidance.editor.title">
    <div className="stage-editor-section">
      <div id={getFieldId('title')} data-name="Title text" />
      <h2 id="title">Page Heading</h2>
      <p>
        Use the page heading to show a large title element on your information stage.
      </p>
      <ValidatedField
        name="title"
        component={Fields.Text}
        placeholder="Enter your title here"
        className="stage-editor-section-title"
        validation={{ required: true }}
      />
    </div>
  </Guidance>
);

export default Title;
