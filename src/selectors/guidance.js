/* eslint-disable import/prefer-default-export */
import { get } from 'lodash';
import locales from '../locales';

/*
 * get guidance content from locales, currently hard-coded to enUS.
 */
export const getGuidance = state => ({
  content: get(locales, ['enUS', state.guidance.id], ''),
  key: state.guidance.id,
});
