import React from 'react';
import { map } from 'lodash';
import Stage from './Stage';

const Stages = ({ stages, codebook }) => (
  <div>
    Stages
    {stages && map(stages, ({
      type,
      label,
      id,
      ...configuration
    }, index) => (
      <Stage
        type={type}
        label={label}
        id={id}
        index={index + 1}
        configuration={configuration}
        codebook={codebook}
      />
    ))}
  </div>
);

Stages.defaultProps = {
  stages: [],
  codebook: {},
};

export default Stages;
