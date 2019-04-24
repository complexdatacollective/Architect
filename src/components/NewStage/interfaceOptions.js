const interfaceOptions = [
  {
    category: 'Name Generators',
    interfaces: [
      {
        type: 'NameGenerator',
        title: 'Name Generator',
      },
      {
        type: 'NameGeneratorList',
        title: 'Roster Name Generator (list)',
      },
      {
        type: 'NameGeneratorAutoComplete',
        title: 'Roster Name Generator (search)',
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
