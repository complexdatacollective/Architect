import React from 'react';

const StageTitle = () => null;
const StageNodeType = () => null;
const StageForm = () => null;
const StagePrompts = () => null;
const StagePanels = () => null;

const EditStage = () => (
  <div className="edit-stage">
    <div className="edit-stage__section">
      <StageTitle />
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
