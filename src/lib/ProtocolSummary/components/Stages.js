import React from 'react';
import Stage from './Stage';

const Stages = ({ stages, codebook }) => (
  <div>
    Stages
    {stages && stages.map((stage) => (
      <Stage stage={stage} codebook={codebook} />
    ))}
  </div>
);

Stages.defaultProps = {
  stages: [],
  codebook: {},
};

export default Stages;
