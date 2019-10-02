import React from 'react';
import { Icon, Node } from '@ui/components';

const EntityIcon = ({ entity, color }) => {
  switch (entity) {
    case 'node':
      return <Node label="" color={color} />;
    case 'edge':
      return <Icon name="links" color={color} />;
    default:
      return `No icon found for ${entity}.`;
  }
};

export default EntityIcon;
