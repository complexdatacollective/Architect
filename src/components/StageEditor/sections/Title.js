import React, { Fragment } from 'react';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../../components/Form';
import SeamlessText from '../../../components/Form/Fields/SeamlessText';

const Title = () => (
  <Guidance contentId="guidance.editor.title">
    <div>
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

Title.propTypes = {
};

Title.Guidance = (
  <Fragment>
    <h3>Title help</h3>
    <p>
      A good stage title should be descriptive, but not too long. It should help you to remember the
      purpose of this stage later.
    </p>
    <p>
      It might help to use a standard format for the names of your interview stages, such as
      <code>[TYPE]: [VARIABLE]</code>
    </p>
    <p>
      This text is displayed in the menu within Network Canvas, and on the timeline in Architect.
    </p>
  </Fragment>
);

export default Title;
