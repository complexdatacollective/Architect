import { get, last } from 'lodash';

export const getLocus = (state) => last(get(state, ['protocol', 'timeline']));

export const hasChanges = (state, locus) => {
  const { timeline } = state.protocol;
  return timeline.findIndex((id) => id === locus) < timeline.length - 1;
};
