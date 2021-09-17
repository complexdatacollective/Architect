import PropTypes from 'prop-types';

const interfaceTypes = [
  {
    id: 'NameGenerator',
    category: 'generator',
    name: 'Name Generator',
  },
  {
    id: 'NameGeneratorRoster',
    category: 'generator',
    name: 'Name Generator Rost',
  },
  {
    id: 'DyadCensus',
    category: 'generator',
    name: 'Dyad Census',
  },
  {
    id: 'Sociogram',
    category: 'sociogram',
    name: 'Sociogram',
  },
  {
    id: 'EgoForm',
    category: 'interpreter',
    name: 'Ego Form',
  },
  {
    id: 'AlterForm',
    category: 'interpreter',
    name: 'Per Alter Form',
  },
  {
    id: 'Information',
    category: 'utility',
    name: 'Information',
  },
];

export const interfaceShape = PropTypes.shape({
  id: PropTypes.string,
  category: PropTypes.string,
  name: PropTypes.string,
});

export default interfaceTypes;
