const interfaceOptions = [
  {
    category: 'Name and Edge Generators',
    interfaces: [
      {
        type: 'NameGenerator',
        title: 'Name Generator (using forms)',
      },
      {
        type: 'NameGeneratorQuickAdd',
        title: 'Name Generator (using quick add)',
      },
      {
        type: 'NameGeneratorList',
        title: 'Small Roster Name Generator',
      },
      {
        type: 'NameGeneratorAutoComplete',
        title: 'Large Roster Name Generator',
      },
      {
        type: 'DyadCensus',
        title: 'Dyad Census',
      },
      {
        type: 'TieStrengthCensus',
        title: 'Tie-Strength Census',
      },
    ],
  },
  {
    category: 'Sociograms',
    interfaces: [
      {
        type: 'Sociogram',
        title: 'Sociogram',
      },
      {
        type: 'Narrative',
        title: 'Narrative',
      },
    ],
  },
  {
    category: 'Name and Edge Interpreters',
    interfaces: [
      {
        type: 'OrdinalBin',
        title: 'Ordinal Bin',
      },
      {
        type: 'CategoricalBin',
        title: 'Categorical Bin',
      },
      {
        type: 'AlterForm',
        title: 'Per Alter Form',
      },
      {
        type: 'AlterEdgeForm',
        title: 'Per Alter Edge Form',
      },
      {
        type: 'EgoForm',
        title: 'Ego Form',
      },
    ],
  },
  {
    category: 'Utilities',
    interfaces: [
      {
        type: 'Information',
        title: 'Information',
      },
    ],
  },
];

export default interfaceOptions;
