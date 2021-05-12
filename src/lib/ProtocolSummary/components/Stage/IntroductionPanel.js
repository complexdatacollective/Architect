import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';

const IntroductionPanel = ({ introductionPanel }) => {
  if (!introductionPanel) { return null; }

  return (
    <div className="protocol-summary-stage__introduction-panel">
      <h2>Introduction Panel</h2>
      <div className="protocol-summary-stage__introduction-panel-content">
        <h1>{introductionPanel.title}</h1>
        <Markdown source={introductionPanel.text} />
      </div>
    </div>
  );
};

IntroductionPanel.propTypes = {
  introductionPanel: PropTypes.shape({
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
};

IntroductionPanel.defaultProps = {
  introductionPanel: null,
};

export default IntroductionPanel;
