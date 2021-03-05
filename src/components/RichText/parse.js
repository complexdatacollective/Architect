import slate from 'remark-slate';
import unified from 'unified';
import markdown from 'remark-parse';
import { isEmpty } from 'lodash';

export const defaultValue = [{
  children: [
    { text: '' },
  ],
}];

// TODO: Can we make this synchronous?
const parse = (value) => {
  if (!value || isEmpty(value)) {
    return Promise.resolve(defaultValue);
  }

  return unified()
    .use(markdown)
    .use(slate)
    .process(value)
    .then(({ result }) => result);
};

export default parse;
