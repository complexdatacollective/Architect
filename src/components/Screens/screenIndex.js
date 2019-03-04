import React from 'react';
import { get } from 'lodash';
import StageEditorScreen from './StageEditorScreen';
import EditSkipLogic from './EditSkipLogic';
import ViewForms from './ViewForms';
import FormEditorScreen from './FormEditorScreen';
import Codebook from './VariableRegistry';
import TypeEditorScreen from './TypeEditorScreen';
import VariableEditorScreen from './VariableEditorScreen';

const NotFound = () => (<div> Screen not found </div>);

const SCREEN_INDEX = {
  stage: StageEditorScreen,
  skip: EditSkipLogic,
  forms: ViewForms,
  form: FormEditorScreen,
  codebook: Codebook,
  type: TypeEditorScreen,
  variable: VariableEditorScreen,
};

const getScreenComponent = screen =>
  get(SCREEN_INDEX, screen, NotFound);

export { getScreenComponent };

export default SCREEN_INDEX;
