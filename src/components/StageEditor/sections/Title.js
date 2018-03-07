import React from 'react';
import PropTypes from 'prop-types';
import { SeamlessTextInput } from '../../../components/Form';

const Title = ({ stage: { title }, onChange }) => (
  <div className="stage-editor-section">
    <div className="stage-editor-section__edit" key="edit">
      <h2>Title</h2>
      <SeamlessTextInput
        value={title}
        placeholder="Enter your title here"
        className="stage-editor-section-title"
        onChange={newTitle => onChange({ title: newTitle })}
      />
    </div>
    <div className="stage-editor-section__guidance">
      What is the title for this interface?
    </div>
  </div>
);

Title.propTypes = {
  stage: PropTypes.object,
  onChange: PropTypes.func,
};

Title.defaultProps = {
  stage: {},
  onChange: () => {},
};

export default Title;
