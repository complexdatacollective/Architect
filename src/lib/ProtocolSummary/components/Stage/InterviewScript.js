import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';

const InterviewScript = ({ interviewScript }) => (
  <div className="protocol-summary-stage__interview-script">
    <div className="protocol-summary-stage__interview-script-content">
      <h2 className="section-heading">Interview Script</h2>
      <Markdown source={interviewScript} />
    </div>
  </div>
);

InterviewScript.propTypes = {
  interviewScript: PropTypes.string,
};

InterviewScript.defaultProps = {
  interviewScript: null,
};

export default InterviewScript;
