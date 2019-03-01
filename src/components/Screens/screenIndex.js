import React from 'react';
import { get } from 'lodash';
import StageEditorScreen from './StageEditorScreen';
import EditSkipLogic from './EditSkipLogic';
import ViewForms from './ViewForms';
import EditForm from './EditForm';
import Codebook from './VariableRegistry';
import EditType from './EditType';
import VariableEditorScreen from './VariableEditorScreen';

const NotFound = () => (<div> Screen not found </div>);

const SCREEN_INDEX = {
  stage: StageEditorScreen,
  skip: EditSkipLogic,
  forms: ViewForms,
  form: EditForm,
  codebook: Codebook,
  type: EditType,
  variable: VariableEditorScreen,
};

const getScreenComponent = screen =>
  get(SCREEN_INDEX, screen, NotFound);

export { getScreenComponent };

export default SCREEN_INDEX;
