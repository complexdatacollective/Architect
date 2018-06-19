/* eslint-disable import/prefer-default-export */

import { get } from 'lodash';
import Information from './Information';
import NameGenerator from './NameGenerator';
import Sociogram from './Sociogram';

const interfaces = {
  Information,
  NameGenerator,
  Sociogram,
};

const emptyInterface = {
  sections: [],
};

export const getInterface = interfaceType =>
  get(interfaces, interfaceType, emptyInterface);
