/* eslint-disable import/prefer-default-export */
import { get } from 'lodash';
import locales from '../locales';

/*
 * get content from locales, currently hard-coded to enUS.
 */
export const getContent = (state, contentId) =>
  get(locales, [state.locale, contentId], '');
