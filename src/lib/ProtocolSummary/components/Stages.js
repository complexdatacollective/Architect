import React from 'react';
import { map } from 'lodash';
import Stage from './Stage';

const Stages = ({ stages, index }) => (
  <div>
    Stages
    {stages && map(stages, ({
      type,
      label,
      id,
      ...configuration
    }, i) => (
      <Stage
        type={type}
        label={label}
        id={id}
        stageNumber={i + 1}
        configuration={configuration}
        index={index}
      />
    ))}
  </div>
);

Stages.defaultProps = {
  stages: [],
  codebook: {},
};

export default Stages;
