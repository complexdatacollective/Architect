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
  },
  {
    category: CATEGORIES.generators,
    type: 'NameGeneratorQuickAdd',
    title: 'Name Generator (using quick add)',
  },
  {
    category: CATEGORIES.generators,
    type: 'NameGeneratorList',
    title: 'Small Roster Name Generator',
  },
  {
    category: CATEGORIES.generators,
    type: 'NameGeneratorAutoComplete',
    title: 'Large Roster Name Generator',
  },
  {
    category: CATEGORIES.generators,
    type: 'DyadCensus',
    title: 'Dyad Census',
  },
  {
    category: CATEGORIES.generators,
    type: 'TieStrengthCensus',
    title: 'Tie-Strength Census',
  },
  {
    category: CATEGORIES.sociograms,
    type: 'Sociogram',
    title: 'Sociogram',
  },
  {
    category: CATEGORIES.sociograms,
    type: 'Narrative',
    title: 'Narrative',
  },
  {
    category: CATEGORIES.interpreters,
    type: 'OrdinalBin',
    title: 'Ordinal Bin',
  },
  {
    category: CATEGORIES.interpreters,
    type: 'CategoricalBin',
    title: 'Categorical Bin',
  },
  {
    category: CATEGORIES.interpreters,
    type: 'AlterForm',
    title: 'Per Alter Form',
  },
  {
    category: CATEGORIES.interpreters,
    type: 'AlterEdgeForm',
    title: 'Per Alter Edge Form',
  },
  {
    category: CATEGORIES.interpreters,
    type: 'EgoForm',
    title: 'Ego Form',
  },
  {
    category: CATEGORIES.utilities,
    type: 'Information',
    title: 'Information',
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
