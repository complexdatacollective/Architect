/* eslint-disable */

import React from 'react';
import { Section, Edit, Guidance } from '../../Guided';

const Prompts = ({ stage, onChange, ...props }) => (
  <Section className="stage-editor-section" {...props}>
    <Edit className="stage-editor-section__edit">
      <h2></h2>
    </Edit>
    <Guidance className="stage-editor-section__guidance" />
  </Section>
);

export default Prompts;
