import { map } from 'lodash';
import { useContext } from 'react';

import Stage from './Stage';
import SummaryContext from './SummaryContext';

const Stages = () => {
  const {
    protocol: { stages },
  } = useContext(SummaryContext);

  return (
    <div>
      {stages &&
        map(stages, ({ type, label, id, ...configuration }, i) => (
          <Stage
            key={id}
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

export default Stages;
