/* eslint-disable import/prefer-default-export */
import { get } from 'lodash';
import AlterEdgeForm from './AlterEdgeForm';
import AlterForm from './AlterForm';
import CategoricalBin from './CategoricalBin';
import DyadCensus from './DyadCensus';
import TieStrengthCensus from './TieStrengthCensus';
import EgoForm from './EgoForm';
import Information from './Information';
import NameGenerator from './NameGenerator';
import NameGeneratorAutoComplete from './NameGeneratorAutoComplete';
import NameGeneratorList from './NameGeneratorList';
import NameGeneratorQuickAdd from './NameGeneratorQuickAdd';
import Narrative from './Narrative';
import OrdinalBin from './OrdinalBin';
import Sociogram from './Sociogram';

const interfaces = {
  AlterEdgeForm,
  AlterForm,
  CategoricalBin,
  DyadCensus,
  TieStrengthCensus,
  EgoForm,
  Information,
  NameGenerator,
  NameGeneratorAutoComplete,
  NameGeneratorList,
  NameGeneratorQuickAdd,
  Narrative,
  OrdinalBin,
  Sociogram,
};

const emptyInterface = {
  sections: [],
  template: {},
};

export const getInterface = (interfaceType) => get(interfaces, interfaceType, emptyInterface);
