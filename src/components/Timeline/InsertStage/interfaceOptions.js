import React from 'react';

export default [
  {
    type: 'NameGenerator',
    title: 'Name Generator',
    guidance: {
      description: (
        <p>
          The Name Generator interface is designed to prompt your research
          participants to name alters. It includes the ability to include
          external network data in the form of a roster.
        </p>
      ),
    },
  },
  {
    type: 'NameGeneratorList',
    title: 'Roster Name Generator (list)',
    guidance: {
      description: (<p>Roster Name Generator (list)</p>),
    },
  },
  {
    type: 'NameGeneratorAutoComplete',
    title: 'Roster Name Generator (search)',
    guidance: {
      description: (<p>Roster Name Generator (search)</p>),
    },
  },
  {
    type: 'Sociogram',
    title: 'Sociogram',
    guidance: {
      description: (
        <div>
          <p>
            The Sociogram interface allows your participants to position alters
            spatially, either using the concentric circles framework, or a
            background image of your choosing.
          </p>
          <p>It also allows the creation of edges between alters based on any
            criteria, and the nomination of alters using an boolean variable.
          </p>
        </div>
      ),
    },
  },
  {
    type: 'OrdinalBin',
    title: 'Ordinal Bin',
    guidance: {
      description: (
        <p>
          The Ordinal Bin interface allows your participants to quickly assign the
          value of an ordinal variable to an alter or edge.
        </p>
      ),
    },
  },
  {
    type: 'CategoricalBin',
    title: 'Categorical Bin',
    guidance: {
      description: (
        <p>
          The Categorical Bin interface allows your participants to quickly
          assign the value of a categorical variable to an alter or edge.
        </p>
      ),
    },
  },
  {
    type: 'Information',
    title: 'Information',
    guidance: {
      description: (
        <p>
          The Information Interface allows you to display text and rich
          media (including pictures, video and audio) to your participants.
          Use it to introduce your research, help explain interview tasks,
          or illustrate concepts or ideas.
        </p>
      ),
    },
  },
  {
    type: 'AlterForm',
    title: 'Per Alter Form',
    guidance: {
      description: (
        <p>
          The Per Alter Form Interface is for back-filling additional information
          about nodes which might be missed during the general flow of your
          interview.
        </p>
      ),
    },
  },
  {
    type: 'EgoForm',
    title: 'Ego Form',
    guidance: {
      description: (
        <p>
          The Ego Form Interface is for...
        </p>
      ),
    },
  },
  {
    type: 'Narrative',
    title: 'Narrative',
    guidance: {
      description: (
        <p>
          The Narrative Interface is used to guide a conversation with a participants.
          It does not modify the participant network. You are expected to use your own
          audio/visual recording equipment.
        </p>
      ),
    },
  },
];
