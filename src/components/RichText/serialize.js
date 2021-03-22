import { serialize } from 'remark-slate';

const serializeNodes = (nodes) => (
  nodes.map((n) => serialize(n)).join('\n')
);

export default serializeNodes;
