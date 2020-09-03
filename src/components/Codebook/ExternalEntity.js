import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { readExternalData, getVariablesFromExternalData, getAssetPath } from '@selectors/assets';
import VariableList from './VariableList';

const ExternalEntity = ({
  name,
  id,
}) => {
  const [variables, setVariables] = useState([]);

  const assetPath = useSelector(state => getAssetPath(state, id));

  useEffect(() => {
    if (!assetPath) { return; }

    readExternalData(assetPath)
      .then(getVariablesFromExternalData)
      .then(v => v.map(({ label }) => label))
      .then(setVariables);
  }, [id]);


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
          <VariableList
            variables={variables}
          />
        </div>
      }
    </div>
  );
};

ExternalEntity.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export { ExternalEntity };

export default ExternalEntity;
