/* eslint-disable */

import React from 'react';
import Title from './Title';
import NodeType from './NodeType';

const StageForm = () => null;
const StagePrompts = () => null;
const StagePanels = () => null;

const EditStage = ({ stage: { title, type }, onChange }) => (
  <div className="edit-stage">
    <div className="edit-stage__section">
      <Title value={title} onChange={title => { onChange({ title }); } } />
      <NodeType value={type} onChange={type => { onChange({ type }); } }  />
      <StageForm />
      <StagePrompts />
      <StagePanels />
    </div>
    <div className="edit-skip-logic__guidance">
      This is some guidance about that section.
    </div>
  </div>
);

export default EditStage;
