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
  EGO_DATA: 'Capture Ego data',
  NODE_ATTRIBUTES: 'Capture Node Attributes',
  EDGE_ATTRIBUTES: 'Capture Edge Attributes',
  ROSTER_DATA: 'Use Roster Data',
  SHOW_MEDIA: 'Display Media',
  PROVIDE_INFORMATION: 'Display Data',
};

export const TAG_COLORS = {
  [TAGS.CREATE_NODES]: 'neon-coral',
  [TAGS.CREATE_EDGES]: 'mustard',
  [TAGS.EGO_DATA]: 'sea-green',
  [TAGS.NODE_ATTRIBUTES]: 'cerulean-blue',
  [TAGS.EDGE_ATTRIBUTES]: 'purple-pizazz',
  [TAGS.ROSTER_DATA]: 'paradise-pink',
  [TAGS.SHOW_MEDIA]: 'neon-carrot',
  [TAGS.PROVIDE_INFORMATION]: 'barbie-pink',
};

export const INTERFACE_TYPES = [
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_NODES, TAGS.NODE_ATTRIBUTES, TAGS.ROSTER_DATA],
    keywords: 'namegenerator name generator form attributes nodes node roster',
    type: 'NameGenerator',
    title: 'Name Generator (using forms)',
    description: 'A name generator interface which provides a form that participants complete when creating an alter.',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_NODES, TAGS.ROSTER_DATA],
    keywords: 'namegenerator name generator quick add simple easy nodes node create roster',
    type: 'NameGeneratorQuickAdd',
    title: 'Name Generator (quick add)',
    description: 'A name generator interface designed for low response-burden. Only requires a label in order to create an alter.',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_NODES, TAGS.ROSTER_DATA],
    keywords: 'namegenerator name generator search add import list filter roster nodes node csv create',
    type: 'NameGeneratorRoster',
    title: 'Name Generator for Roster Data',
    description: 'A name generator specifically for roster data, allowing sorting and filtering of the roster.',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_EDGES],
    keywords: 'edge tie generator edges create add',
    type: 'DyadCensus',
    title: 'Dyad Census',
    description: 'A name interpreter interface that creates edges by systematically surveying all alters in the interview network.',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_EDGES],
    keywords: 'edge tie generator edges create add',
    type: 'OneToManyDyadCensus',
    title: 'One to Many Dyad Census',
    description: 'A name interpreter interface that creates edges by systematically surveying one alter against many others in the interview network.',
  },
  {
    category: CATEGORIES.GENERATORS,
    tags: [TAGS.CREATE_EDGES, TAGS.EDGE_ATTRIBUTES],
    keywords: 'edge tie generator census dyad edges create strength ordinal',
    type: 'TieStrengthCensus',
    title: 'Tie-Strength Census',
    description: 'Combines a dyad census with an ordinal variable to simultaneously capture the strength of ties between alters.',
  },
  {
    category: CATEGORIES.SOCIOGRAMS,
    tags: [TAGS.CREATE_EDGES, TAGS.NODE_ATTRIBUTES, TAGS.SHOW_MEDIA],
    keywords: 'sociogram visual edges highlight visualize visualise',
    type: 'Sociogram',
    title: 'Sociogram',
    description: 'Designed for spatially arranging alters (either manually or automatically), creating edges between them, and highlighting the presence of alter attributes.',
  },
  {
    category: CATEGORIES.SOCIOGRAMS,
    tags: [TAGS.PROVIDE_INFORMATION, TAGS.SHOW_MEDIA],
    keywords: 'sociogram narrative visual visualize highlight community qualitative',
    type: 'Narrative',
    title: 'Narrative',
    description: 'A qualitative interface that uses "presets" to switch between different views of the data in the network.',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.NODE_ATTRIBUTES],
    keywords: 'ordinal bin node attributes categorical name interpreter',
    type: 'OrdinalBin',
    title: 'Ordinal Bin',
    description: 'A name interpreter interface that captures ordinal data by allowing the participant to drag and drop alters into bins.',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.NODE_ATTRIBUTES],
    keywords: 'categorical bin node attributes name interpreter',
    type: 'CategoricalBin',
    title: 'Categorical Bin',
    description: 'A name interpreter interface that collects nominal data by allowing the participant to drag and drop alters into circles representing a category.',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.NODE_ATTRIBUTES],
    keywords: 'alter attributes node interpreter form forms',
    type: 'AlterForm',
    title: 'Per Alter Form',
    description: 'An interface that allows the participant to fill out a form for each alter in the interview network.',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.NODE_ATTRIBUTES],
    keywords: 'alter attributes node interpreter map',
    type: 'Geospatial',
    title: 'Geospatial Interface',
    description: 'An interface that captures geospatial data by allowing the user to select items on a map',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.EDGE_ATTRIBUTES],
    keywords: 'edge attributes form forms edge interpreter',
    type: 'AlterEdgeForm',
    title: 'Per Alter Edge Form',
    description: 'An edge interpreter interface that captures attribute data via a form.',
  },
  {
    category: CATEGORIES.INTERPRETERS,
    tags: [TAGS.EGO_DATA],
    keywords: 'ego survey participant form forms',
    type: 'EgoForm',
    title: 'Ego Form',
    description: 'An interface that collects data on your participant (ego).',
  },
  {
    category: CATEGORIES.UTILITIES,
    tags: [TAGS.SHOW_MEDIA, TAGS.PROVIDE_INFORMATION],
    keywords: 'instruction text participant guide intro image video audio media resource',
    type: 'Information',
    title: 'Information',
    description: 'A general purpose screen that can be used to present information to participants using a variety of text and media resources.',
  },
  {
    category: CATEGORIES.UTILITIES,
    tags: [TAGS.NODE_ATTRIBUTES],
    keywords: 'instruction text participant guide intro image video audio media resource',
    type: 'Anonymisation',
    title: 'Anonymisation Interface',
    description: 'An interface that allows the participant to set a passphrase for node anonymisation.',
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
