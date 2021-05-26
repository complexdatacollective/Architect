import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '@codaco/ui/lib/components/Fields/Markdown';

const InterviewScript = ({ interviewScript }) => (
  <div className="protocol-summary-stage__interview-script">
    <div className="protocol-summary-stage__interview-script-content">
      <h2 className="section-heading">Interviewer Script</h2>
      {interviewScript && (
        <Markdown label={interviewScript} />
      )}
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
