import StandardPropTypes from 'prop-types';

export const CATEGORIES = {
  GENERATORS: 'Name and Edge Generators',
  SOCIOGRAMS: 'Sociograms',
  INTERPRETERS: 'Name and Edge Interpreters',
  UTILITIES: 'Utilities',
};

export const TAGS = {
  CREATE_NODES: 'Create nodes',
  CREATE_EDGES: 'Create edges',
  EGO_DATA: 'Ego data',
  NODE_ATTRIBUTES: 'Add Node Attributes',
  EDGE_ATTRIBUTES: 'Add Edge Attributes',
  ROSTER_DATA: 'Use Roster Data',
};

export const INTERFACE_TYPES = [
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_NODES, TAGS.NODE_ATTRIBUTES],
    type: 'NameGenerator',
    title: 'Name Generator (using forms)',
    keywords: 'generator form',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_NODES],
    type: 'NameGeneratorQuickAdd',
    title: 'Name Generator (using quick add)',
    keywords: 'generator quick',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_NODES, TAGS.ROSTER_DATA],
    type: 'NameGeneratorList',
    title: 'Small Roster Name Generator',
    keywords: 'generator search list',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_NODES, TAGS.ROSTER_DATA],
    type: 'NameGeneratorAutoComplete',
    title: 'Large Roster Name Generator',
    keywords: 'generator search list',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_EDGES],
    type: 'DyadCensus',
    title: 'Dyad Census',
    keywords: 'edge tie generator',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.EDGE_ATTRIBUTES],
    type: 'TieStrengthCensus',
    title: 'Tie-Strength Census',
    keywords: 'edge tie generator',
  },
  {
    category: CATEGORIES.SOCIOGRAMS,
    tags: [TAGS.CREATE_EDGES, TAGS.NODE_ATTRIBUTES],
    type: 'Sociogram',
    title: 'Sociogram',
    keywords: 'sociogram graph edge',
  },
  {
    category: CATEGORIES.SOCIOGRAMS,
    tags: [],
    type: 'Narrative',
    title: 'Narrative',
    keywords: 'sociogram',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.NODE_ATTRIBUTES],
    type: 'OrdinalBin',
    title: 'Ordinal Bin',
    keywords: 'interpreter',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.NODE_ATTRIBUTES],
    type: 'CategoricalBin',
    title: 'Categorical Bin',
    keywords: 'interpreter',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.NODE_ATTRIBUTES],
    type: 'AlterForm',
    title: 'Per Alter Form',
    keywords: 'interpreter',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.EDGE_ATTRIBUTES],
    type: 'AlterEdgeForm',
    title: 'Per Alter Edge Form',
    keywords: 'interpreter',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.EGO_DATA],
    type: 'EgoForm',
    title: 'Ego Form',
    keywords: 'interpreter',
  },
  {
    category: CATEGORIES.UTILITIES,
    tags: [],
    type: 'Information',
    title: 'Information',
    keywords: 'instruction guide intro',
  },
];

export const PropTypes = {
  interface: StandardPropTypes.shape({
    type: StandardPropTypes.string,
    tags: StandardPropTypes.arrayOf(StandardPropTypes.string),
    category: StandardPropTypes.string,
    title: StandardPropTypes.string,
  }),
};

export default INTERFACE_TYPES;
