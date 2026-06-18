import { get } from 'lodash';

import AssetsScreen from './AssetsScreen';
import Codebook from './CodebookScreen';
import NewStageScreen from './NewStageScreen';
import StageEditorScreen from './StageEditorScreen';
import TypeEditorScreen from './TypeEditorScreen';

const NotFound = () => <div> Screen not found </div>;

const SCREEN_INDEX = {
  stage: StageEditorScreen,
  codebook: Codebook,
  type: TypeEditorScreen,
  newStage: NewStageScreen,
  assets: AssetsScreen,
};

const getScreenComponent = (screen) => get(SCREEN_INDEX, screen, NotFound);

export { getScreenComponent };
