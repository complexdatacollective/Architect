const interfaceOptions = [
  {
    category: 'Name Generators',
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
    category: 'Name Interpreters',
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
      {
        type: 'DyadCensus',
        title: 'Dyad Census',
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

export { interfaceOptions };

export default interfaceOptions;
