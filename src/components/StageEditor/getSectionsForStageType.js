import { get } from 'lodash';
import {
  Title,
  ContentItems,
  NodeType,
  Form,
  NameGeneratorPrompts,
  NodePanels,
} from './sections';


const interfaces = {
  Information: [
    Title,
    ContentItems,
  ],
  NameGenerator: [
    Title,
    NodeType,
    Form,
    NameGeneratorPrompts,
    NodePanels,
  ],
};

const getSectionsForStageType = stageType =>
  get(interfaces, stageType, []);

export default getSectionsForStageType;
