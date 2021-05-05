import React, { useContext } from 'react';
import { map } from 'lodash';
import SummaryContext from './SummaryContext';
import Stage from './Stage';

const Stages = () => {
  const {
    protocol: { stages },
  } = useContext(SummaryContext);

  return (
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
        />
      ))}
    </div>
  );
};

Stages.defaultProps = {
  stages: [],
  codebook: {},
};

export default Stages;
