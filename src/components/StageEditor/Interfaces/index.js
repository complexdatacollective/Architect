/* eslint-disable import/prefer-default-export */
import { get } from 'lodash';
import Information from './Information';
import NameGenerator from './NameGenerator';
import NameGeneratorList from './NameGeneratorList';
import NameGeneratorAutoComplete from './NameGeneratorAutoComplete';
import Sociogram from './Sociogram';
import CategoricalBin from './CategoricalBin';
import OrdinalBin from './OrdinalBin';
import AlterForm from './AlterForm';
import EgoForm from './EgoForm';
import Narrative from './Narrative';

const interfaces = {
  Information,
  NameGenerator,
  NameGeneratorList,
  NameGeneratorAutoComplete,
  Sociogram,
  CategoricalBin,
  OrdinalBin,
  AlterForm,
  EgoForm,
  Narrative,
};

const emptyInterface = {
  sections: [],
};

export const getInterface = interfaceType =>
  get(interfaces, interfaceType, emptyInterface);
