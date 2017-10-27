import {
  filter,
  reduce,
  includes,
  map,
  flatMap,
  unionWith,
  isEqual,
  flow as and,
  isNull,
} from 'lodash';

/*

Premise, using additive pipes to filter network.

network -> filterA -> filterB -> output;

// PSEUDOCODE

alter('type', 'attribute', 'operator', 'value')(edges('type')(network))

alter('person', 'age', '>', 29)(edges('friends')(network))

compose(
  edges('friends'),
  alter('person', 'age', '>', 29),
)(network);

*/

const emptyNetwork = {
  nodes: [],
  edges: [],
};

const predicate = ({ operator, value }) =>
  (input) => {
    switch (operator) {
      case 'gt':
        return input > value;
      case 'lt':
        return input < value;
      case 'gte':
        return input >= value;
      case 'lte':
        return input <= value;
      case 'eq':
        return input == value; // eslint-disable-line eqeqeq
      case 'not':
        return input != value; // eslint-disable-line eqeqeq
      case 'exists':
        return isNull(input);
      default:
        return false;
    }
  };

const edge = ({
  type,
}) =>
  (network) => {
    const edges = filter(network.edges, ['type', type]);
    // TODO: extract next two lines into reusable method, and do one for node -> edge
    const ids = flatMap(edges, ({ from, to }) => [from, to]);
    const nodes = filter(network.nodes, ({ id }) => includes(ids, id));

    return {
      edges,
      nodes,
    };
  };

const alter = ({
  type,
  attribute,
  operator,
  value,
}) =>
  (network) => {
    const sourceNodes = attribute ? filter(network.nodes, ['type', type]) : network.nodes;
    const nodes = filter(sourceNodes, node => predicate({ operator, value })(node[attribute]));
    const ids = map(nodes, 'id');
    const edges = filter(
      network.edges,
      ({ from, to }) => includes(ids, from) || includes(ids, to),
    );

    return {
      nodes,
      edges,
    };
  };

const ego = ({
  attribute,
  operator,
  value,
}) =>
  (network) => {
    const egoNode = filter(network.nodes, ['id', 1]); // `id` 1 assumed to be ego
    if (predicate(operator, value)(ego[attribute])) {
      const edges = filter(network.edges, ({ from, to }) => includes([from, to], 1));
      return {
        nodes: [egoNode],
        edges,
      };
    }
    return { ...emptyNetwork };
  };


const or = steps =>
  network => reduce(
    steps,
    (memo, step) => {
      const result = step(network);
      return ({
        nodes: unionWith(memo.nodes, result.nodes, isEqual),
        edges: unionWith(memo.edges, result.edges, isEqual),
      });
    },
    { ...emptyNetwork },
  );

export {
  or,
  and,
  alter,
  ego,
  edge,
};
