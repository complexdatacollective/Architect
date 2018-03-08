import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  ContentItems,
} from './sections';
import { Guided, Section, Edit } from '../Guided';

/*
 * Renders the relevant interface editor
 */

// Example interface layout
const informationInterface = [
  Title,
  ContentItems,
];

const renderSections = (interfaceSections, props) => {
  if (interfaceSections.length === 0) { return (<div>Not yet editable.</div>); }

  return interfaceSections.map(
    (InterfaceSection, index) =>
      <InterfaceSection {...props} key={index} />,
  );
};

const StageEditor = (props) => {
  const interfaceSections = props.stage.type === 'Information' ?
    informationInterface :
    [];

  return (
    <div className="stage-editor">
      <Guided>
        <Section className="stage-editor-section">
          <Edit className="stage-editor-section__edit">
            <h1>Edit {props.stage.type} Screen</h1>
          </Edit>
        </Section>
        { renderSections(interfaceSections, props) }
      </Guided>
    </div>
  );
};

StageEditor.propTypes = {
  stage: PropTypes.object.isRequired,
};

export default StageEditor;
