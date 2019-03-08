import React from 'react';
import { get } from 'lodash';
import StageEditorScreen from './StageEditorScreen';
import SkipLogicEditorScreen from './SkipLogicEditorScreen';
import ViewFormsScreen from './ViewFormsScreen';
import FormEditorScreen from './FormEditorScreen';
import Codebook from './VariableRegistryScreen';
import TypeEditorScreen from './TypeEditorScreen';
import VariableEditorScreen from './VariableEditorScreen';

const NotFound = () => (<div> Screen not found </div>);

const SCREEN_INDEX = {
  stage: StageEditorScreen,
  skip: SkipLogicEditorScreen,
  forms: ViewFormsScreen,
  form: FormEditorScreen,
  codebook: Codebook,
  type: TypeEditorScreen,
  variable: VariableEditorScreen,
};

const getScreenComponent = screen =>
  get(SCREEN_INDEX, screen, NotFound);

export { getScreenComponent };

export default SCREEN_INDEX;
