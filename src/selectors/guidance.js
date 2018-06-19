/* eslint-disable import/prefer-default-export */
import { getContent } from './locales';

/*
 * get guidance content from locales, currently hard-coded to enUS.
 */
export const getGuidance = (state) => {
  if (state.guidance.id === null) { return null; }

  return {
    content: getContent(state, state.guidance.id),
    id: state.guidance.id,
  };
};
