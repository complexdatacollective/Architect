import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  ContentItems,
} from './sections';

/*
 * Renders the relevant interface editor
 */

// Example interface layout
const informationInterface = [
  Title,
  ContentItems,
];

const renderSections = (sections, props) => {
  if (sections.length === 0) { return (<div>Not yet editable.</div>); }

  return sections.map(
    (Section, index) => <Section {...props} key={index} />,
  );
};

const StageEditor = (props) => {
  const interfaceSections = props.stage.type === 'Information' ?
    informationInterface :
    [];

  return (
    <div className="stage-editor">
      { renderSections(interfaceSections, props) }
    </div>
  );
};

StageEditor.propTypes = {
  stage: PropTypes.object.isRequired,
};

export default StageEditor;
