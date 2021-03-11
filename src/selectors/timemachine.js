import { get, last } from 'lodash';

export const makeGetLocus = (path) => (state) => last(get(state, [path, 'timeline']));
