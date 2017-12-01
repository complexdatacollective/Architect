/* eslint-disable */
import React from 'react';
import Title from './Title';

const StageNodeType = () => null;
const StageForm = () => null;
const StagePrompts = () => null;
const StagePanels = () => null;

const EditStage = ({ stage, onChange }) => (
  <div className="edit-stage">
    <div className="edit-stage__section">
      <Title title={stage.title} onChange={title => { onChange({ title }); } }/>
      <StageNodeType />
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
