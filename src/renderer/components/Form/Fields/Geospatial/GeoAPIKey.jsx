import React, { useState } from 'react';
import { fieldPropTypes } from 'redux-form';
import Button from '@codaco/ui/lib/components/Button';
import APIKeyThumbnail from '@components/Thumbnail/APIKey';
import cx from 'classnames';
import APIKeyBrowser from './APIKeyBrowser';

const GeoAPIKey = (props) => {
  const {
    input: {
      value,
      onChange,
    },
  } = props;

  const [showAPIKeyBrowser, setShowAPIKeyBrowser] = useState(false);
  const fieldClasses = cx(
    'form-fields-file',
    {
      'form-fields-file--replace': !!value,
    },
  );
  return (
    <>
      <div className={fieldClasses}>
        <div className="form-fields-file__preview">
          {value && <APIKeyThumbnail id={value} />}
        </div>
        <div className="form-fields-file__browse">

          <Button
            onClick={() => setShowAPIKeyBrowser(true)}
            color="primary"
            size="small"
          >
            { !value ? 'Select API Key' : 'Update API Key' }
          </Button>
        </div>
      </div>
      <APIKeyBrowser
        show={showAPIKeyBrowser}
        close={() => setShowAPIKeyBrowser(false)}
        onSelect={(keyId) => {
          onChange(keyId); // add the keyId as the value for mapOptions.tokenAssetId
        }}
        selected={value}
      />
    </>
  );
};

GeoAPIKey.propTypes = {
  ...fieldPropTypes,
};

export default GeoAPIKey;
