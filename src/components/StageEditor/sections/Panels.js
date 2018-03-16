/* eslint-disable */

import React from 'react';
import { Section, Editor, Guidance } from '../../Guided';

const Panels = ({ stage, onChange, ...props }) => (
  <Section className="stage-editor-section" {...props}>
    <Editor className="stage-editor-section__edit">
      <h2></h2>
    </Editor>
    <Guidance className="stage-editor-section__guidance" />
  </Section>
);

export default Panels;
