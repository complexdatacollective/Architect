import React from 'react';
import { get } from 'lodash';
import StageEditorScreen from './StageEditorScreen';
import SkipLogicEditorScreen from './SkipLogicEditorScreen';
import Codebook from './CodebookScreen';
import TypeEditorScreen from './TypeEditorScreen';
import VariableEditorScreen from './VariableEditorScreen';
import NewStageScreen from './NewStageScreen';

const NotFound = () => (<div> Screen not found </div>);

const SCREEN_INDEX = {
  stage: StageEditorScreen,
  skip: SkipLogicEditorScreen,
  codebook: Codebook,
  type: TypeEditorScreen,
  variable: VariableEditorScreen,
  newStage: NewStageScreen,
};

const getScreenComponent = screen =>
  get(SCREEN_INDEX, screen, NotFound);

export { getScreenComponent };

export default SCREEN_INDEX;
