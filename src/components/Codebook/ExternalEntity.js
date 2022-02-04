import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@codaco/ui';
import useVariablesFromExternalData from '@hooks/useVariablesFromExternalData';
import useExternalDataPreview from '@components/AssetBrowser/useExternalDataPreview';
import useExternalDataDownload from '@components/AssetBrowser/useExternalDataDownload';
import VariableList from './VariableList';
import EntityIcon from './EntityIcon';

const ExternalEntity = ({
  id,
  name,
}) => {
  const { variables } = useVariablesFromExternalData(id);

  const [preview, handleShowPreview] = useExternalDataPreview();
  const handleDownloadAsset = useExternalDataDownload();

  return (
    <>
      <div className="codebook__entity">
        <div className="codebook__entity-detail">
          <div className="codebook__entity-icon">
            <EntityIcon entity="asset" />
          </div>
          <div className="codebook__entity-name">
            <h2>
              {name}
            </h2>
          </div>
          <div className="codebook__entity-meta" />
          <div className="codebook__entity-control">
            <Button
              size="small"
              onClick={() => handleShowPreview(id)}
            >
              Preview
            </Button>
            <Button
              size="small"
              onClick={() => handleDownloadAsset(id)}
              color="sea-serpent"
            >
              Download
            </Button>
          </div>
        </div>
        { variables.length > 0
          && (
          <div className="codebook__entity-variables">
            <h3>Variables:</h3>
            <VariableList
              variables={variables}
            />
          </div>
          )}
      </div>
      {preview}
    </>
  );
};

ExternalEntity.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default ExternalEntity;
