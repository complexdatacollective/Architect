import slate from 'remark-slate';
import unified from 'unified';
import markdown from 'remark-parse';

// TODO: Can we make this synchronous?
const parse = value =>
  unified()
    .use(markdown)
    .use(slate)
    .process(value)
    .then(({ result }) => result);

export default parse;
