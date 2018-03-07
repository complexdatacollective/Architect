/* eslint-disable */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  ContentItems,
} from './sections';

class Guided extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 1,
    };
  }

  onMouseOver = (index) =>
    this.setState({ active: index });

  render() {
    const isActive = this.state.isActive;

    return React.Children.toArray(this.props.children)
      .map((child, index) => {
        const isActive = this.state.active === index;
        return React.cloneElement(
          child,
          {
            isActive,
            onMouseOver: () => this.onMouseOver(index)
          }
        );
      });
  }
}

const Section = ({ children, isActive, onMouseOver }) => (
  <div onMouseOver={onMouseOver}>
    {
      React.Children.toArray(children)
        .map((child) =>
          React.cloneElement(child, { isActive }),
        )
    }
  </div>
);

const Edit = ({ isActive, children }) => (
  <div>
    {isActive && 'Yes' }
    {children}
  </div>
);

const Guidance = ({ isActive, children }) => (
  <div>
    {isActive && 'Yes' }
    {children}
  </div>
);

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
      <Guided>
        <Section>
          <Edit>
            Editor goes here
          </Edit>

          <Guidance>
            Some content here.
          </Guidance>
        </Section>
        <Section>
          <Edit>
            Editor goes here
          </Edit>

          <Guidance>
            Some content here.
          </Guidance>
        </Section>
      </Guided>
      <div className="stage-editor-section">
        <div className="stage-editor-section__edit">
          <h1>{props.stage.type}</h1>
        </div>
        <div className="stage-editor-section__guidance">
          What is the title for this interface?
        </div>
      </div>
      { renderSections(interfaceSections, props) }
    </div>
  );
};

StageEditor.propTypes = {
  stage: PropTypes.object.isRequired,
};

export default StageEditor;
