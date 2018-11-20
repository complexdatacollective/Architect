import React from 'react';

export default [
  {
    type: 'NameGenerator',
    guidance: {
      title: 'Name Generator',
      description: (<p>{'The Name Generator interface is designed to prompt your research participants to name alters. It includes the ability to include external network data in the form of a roster.'}</p>),
    },
  },
  {
    type: 'NameGeneratorList',
    guidance: {
      title: 'Name Generator Roster List',
      description: (<p>{''}</p>),
    },
  },
  {
    type: 'Sociogram',
    guidance: {
      title: 'Sociogram',
      description: (<div><p>{'The Sociogram interface allows your participants to position alters spatially, either using the concentric circles framework, or a background image of your choosing.'}</p><p>{'It also allows the creation of edges between alters based on any criteria, and the nomination of alters using an boolean variable.'}</p></div>),
    },
  },
  {
    type: 'OrdinalBin',
    guidance: {
      title: 'Ordinal Bin',
      description: (<p>{'The Ordinal Bin interface allows your participants to quickly assign the value of an ordinal variable to an alter or edge.'}</p>),
    },
  },
  {
    type: 'CategoricalBin',
    guidance: {
      title: 'Categorical Bin',
      description: (<p>{'The Categorical Bin interface allows your participants to quickly assign the value of a categorical variable to an alter or edge.'}</p>),
    },
  },
  {
    type: 'Information',
    guidance: {
      title: 'Information',
      description: (<p>{'The Information Interface allows you to display text and rich media (including pictures, video and audio) to your participants. Use it to introduce your research, help explain interview tasks, or illustrate concepts or ideas.'}</p>),
    },
  },
];
