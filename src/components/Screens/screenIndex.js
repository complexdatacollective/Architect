import React from 'react';
import { get } from 'lodash';
import StageEditorScreen from './StageEditorScreen';
import Codebook from './CodebookScreen';
import TypeEditorScreen from './TypeEditorScreen';
import NewStageScreen from './NewStageScreen';
import AssetsScreen from './AssetsScreen';

const NotFound = () => (<div> Screen not found </div>);

const SCREEN_INDEX = {
  stage: StageEditorScreen,
  codebook: Codebook,
  type: TypeEditorScreen,
  newStage: NewStageScreen,
  assets: AssetsScreen,
};

const getScreenComponent = (screen) => get(SCREEN_INDEX, screen, NotFound);

export { getScreenComponent };

export default SCREEN_INDEX;
