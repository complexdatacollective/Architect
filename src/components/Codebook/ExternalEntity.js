import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { readExternalData, getVariablesFromExternalData } from '@selectors/assets';
import { Variables } from './Variables';

const ExternalEntity = ({
  name,
  source,
}) => {
  const [variables, setVariables] = useState([]);

  useEffect(() => {
    if (!source) { return; }

    readExternalData(source)
      .then(getVariablesFromExternalData)
      .then(setVariables);
  }, [source]);


  return (
    <div className="codebook__entity">
      <div className="codebook__entity-detail">
        <div className="codebook__entity-icon">
          {/* <EntityIcon color={color} entity={entity} type={type} /> */}
        </div>
        <div className="codebook__entity-name">
          <h2>
            {name}
          </h2>
        </div>
        <div className="codebook__entity-meta">
          {/* { !inUse && <Tag>not in use</Tag> }
          { inUse && <React.Fragment><em>used in:</em> {stages}</React.Fragment> } */}
        </div>
        <div className="codebook__entity-control">
          {/* <Button
            size="small"
            color="neon-coral"
            onClick={handleDelete}
          >
            Delete entity
          </Button> */}
        </div>
      </div>
      { variables.length > 0 &&
        <div className="codebook__entity-variables">
          <h3>Variables:</h3>
          <Variables
            variables={variables}
          />
        </div>
      }
    </div>
  );
};

ExternalEntity.propTypes = {
  name: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};

export { ExternalEntity };

export default ExternalEntity;
