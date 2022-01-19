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

export const TAG_COLORS = {
  [TAGS.CREATE_NODES]: 'neon-coral',
  [TAGS.CREATE_EDGES]: 'mustard',
  [TAGS.EGO_DATA]: 'sea-green',
  [TAGS.NODE_ATTRIBUTES]: 'slate-blue',
  [TAGS.EDGE_ATTRIBUTES]: 'purple-pizazz',
  [TAGS.ROSTER_DATA]: 'paradise-pink',
};

export const INTERFACE_TYPES = [
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_NODES, TAGS.NODE_ATTRIBUTES],
    keywords: 'generator form',
    type: 'NameGenerator',
    title: 'Name Generator (forms)',
    description: 'Create alters using forms.',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_NODES],
    keywords: 'generator quick',
    type: 'NameGeneratorQuickAdd',
    title: 'Name Generator (quick)',
    description: 'Quickly create alters with a label.',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_NODES, TAGS.ROSTER_DATA],
    keywords: 'generator search list',
    type: 'NameGeneratorRoster',
    title: 'Name Generator for Roster Data',
    description: 'Create alters from a roster of network members',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_EDGES],
    keywords: 'edge tie generator',
    type: 'DyadCensus',
    title: 'Dyad Census',
    description: 'Collect edges for every alter pair.',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.EDGE_ATTRIBUTES],
    keywords: 'edge tie generator',
    type: 'TieStrengthCensus',
    title: 'Tie-Strength Census',
    description: 'Collect edges with ordinal value for every alter pair.',
  },
  {
    category: CATEGORIES.SOCIOGRAMS,
    tags: [TAGS.CREATE_EDGES, TAGS.NODE_ATTRIBUTES],
    keywords: 'sociogram graph edge',
    type: 'Sociogram',
    title: 'Sociogram',
    description: 'Visually map alters in the participant network.',
  },
  {
    category: CATEGORIES.SOCIOGRAMS,
    tags: [],
    keywords: 'sociogram',
    type: 'Narrative',
    title: 'Narrative',
    description: 'Elicit qualititive data from participant about their network.',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.NODE_ATTRIBUTES],
    keywords: 'interpreter',
    type: 'OrdinalBin',
    title: 'Ordinal Bin',
    description: 'Capture ordinal data for alters.',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.NODE_ATTRIBUTES],
    keywords: 'interpreter',
    type: 'CategoricalBin',
    title: 'Categorical Bin',
    description: 'Capture categorical data for alters.',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.NODE_ATTRIBUTES],
    keywords: 'interpreter',
    type: 'AlterForm',
    title: 'Per Alter Form',
    description: 'Capture extended attribute data for alters using forms.',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.EDGE_ATTRIBUTES],
    keywords: 'interpreter',
    type: 'AlterEdgeForm',
    title: 'Per Alter Edge Form',
    description: 'Capture extended attribute data for edges using forms.',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.EGO_DATA],
    keywords: 'interpreter',
    type: 'EgoForm',
    title: 'Ego Form',
    description: 'Collect participant data using a form.',
  },
  {
    category: CATEGORIES.UTILITIES,
    tags: [],
    keywords: 'instruction guide intro',
    type: 'Information',
    title: 'Information',
    description: 'Present multimedia information to participants, such as instructions.',
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
