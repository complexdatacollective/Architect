/* eslint-disable import/prefer-default-export */
import { get } from 'lodash';
// import Information from './Information';
import NameGenerator from './NameGenerator';
// import NameGeneratorQuickAdd from './NameGeneratorQuickAdd';
// import NameGeneratorList from './NameGeneratorList';
// import NameGeneratorAutoComplete from './NameGeneratorAutoComplete';
// import Sociogram from './Sociogram';
// import CategoricalBin from './CategoricalBin';
// import OrdinalBin from './OrdinalBin';
// import AlterForm from './AlterForm';
// import AlterEdgeForm from './AlterEdgeForm';
// import EgoForm from './EgoForm';
// import Narrative from './Narrative';

const interfaces = {
  // Information,
  NameGenerator,
  // NameGeneratorQuickAdd,
  // NameGeneratorList,
  // NameGeneratorAutoComplete,
  // Sociogram,
  // CategoricalBin,
  // OrdinalBin,
  // AlterForm,
  // AlterEdgeForm,
  // EgoForm,
  // Narrative,
};

const emptyInterface = {
  sections: [],
  template: {},
};

export const getInterface = interfaceType =>
  get(interfaces, interfaceType, emptyInterface);
