import StandardPropTypes from 'prop-types';

export const CATEGORIES = {
  generators: 'Name and Edge Generators',
  sociograms: 'Sociograms',
  interpreters: 'Name and Edge Interpreters',
  utilities: 'Utilities',
};

export const INTERFACE_TYPES = [
  {
    category: CATEGORIES.generators,
    type: 'NameGenerator',
    title: 'Name Generator (using forms)',
    keywords: 'generator form',
  },
  {
    category: CATEGORIES.generators,
    type: 'NameGeneratorQuickAdd',
    title: 'Name Generator (using quick add)',
    keywords: 'generator quick',
  },
  {
    category: CATEGORIES.generators,
    type: 'NameGeneratorList',
    title: 'Small Roster Name Generator',
    keywords: 'generator search list',
  },
  {
    category: CATEGORIES.generators,
    type: 'NameGeneratorAutoComplete',
    title: 'Large Roster Name Generator',
    keywords: 'generator search list',
  },
  {
    category: CATEGORIES.generators,
    type: 'DyadCensus',
    title: 'Dyad Census',
    keywords: 'edge tie generator',
  },
  {
    category: CATEGORIES.generators,
    type: 'TieStrengthCensus',
    title: 'Tie-Strength Census',
    keywords: 'edge tie generator',
  },
  {
    category: CATEGORIES.sociograms,
    type: 'Sociogram',
    title: 'Sociogram',
    keywords: 'sociogram graph edge',
  },
  {
    category: CATEGORIES.sociograms,
    type: 'Narrative',
    title: 'Narrative',
    keywords: 'sociogram',
  },
  {
    category: CATEGORIES.interpreters,
    type: 'OrdinalBin',
    title: 'Ordinal Bin',
    keywords: 'interpreter',
  },
  {
    category: CATEGORIES.interpreters,
    type: 'CategoricalBin',
    title: 'Categorical Bin',
    keywords: 'interpreter',
  },
  {
    category: CATEGORIES.interpreters,
    type: 'AlterForm',
    title: 'Per Alter Form',
    keywords: 'interpreter',
  },
  {
    category: CATEGORIES.interpreters,
    type: 'AlterEdgeForm',
    title: 'Per Alter Edge Form',
    keywords: 'interpreter',
  },
  {
    category: CATEGORIES.interpreters,
    type: 'EgoForm',
    title: 'Ego Form',
    keywords: 'interpreter',
  },
  {
    category: CATEGORIES.utilities,
    type: 'Information',
    title: 'Information',
    keywords: 'instruction guide intro',
  },
];

export const PropTypes = {
  interface: StandardPropTypes.shape({
    type: StandardPropTypes.string,
    category: StandardPropTypes.string,
    title: StandardPropTypes.string,
  }),
};

export default INTERFACE_TYPES;
