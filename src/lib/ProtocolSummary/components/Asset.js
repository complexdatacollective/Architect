/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useAssetData from './useAssetData';
import MiniTable from './MiniTable';

const Asset = ({ id, size }) => {
  const {
    url,
    type,
    name,
    variables,
  } = useAssetData(id);

  const ref = useRef();
  const [state, setState] = useState({ duration: 0 });
  const metaDataListener = useRef(() => {
    const duration = ref.current.duration.toFixed(2);
    setState({ duration: `${duration}s` });
  });

  useEffect(() => {
    if (ref.current && ['audio', 'video'].includes(type)) {
      ref.current.addEventListener('loadedmetadata', metaDataListener.current);
    }

    return () => {
      ref.current.removeEventListener('loadedmetadata', metaDataListener.current);
    };
  }, [ref.current, type, url]);

  return (
    <div className="protocol-summary-asset-manifest__asset" id={`asset-${id}`}>
      {type === 'image' && (
        <MiniTable
          rotated
          rows={[
            ['Name', name],
            ...(size ? [['Block Size', size]] : []),
            ['Type', 'Image'],
            // eslint-disable-next-line jsx-a11y/media-has-caption
            ['Preview',
              <div className="protocol-summary-asset-manifest__asset-media">
                <img src={url} alt={name} />
              </div>,
            ],
          ]}
        />

      )}

      {type === 'video' && (
        <>
          <MiniTable
            rotated
            rows={[
              ['Name', name],
              ...(size ? [['Block Size', size]] : []),
              ['Type', 'Video'],
              ['Duration', state.duration],
              ['Preview',
                <div className="protocol-summary-asset-manifest__asset-media">
                  <video src={url} ref={ref} preload="auto">
                    <source src={`${url}#t=1`} type="video/mp4" />
                  </video>
                </div>,
              ],
            ]}
          />
        </>
      )}

      {type === 'audio' && (
        <>
          <MiniTable
            rotated
            rows={[
              ['Name', name],
              ...(size ? [['Block Size', size]] : []),
              ['Type', 'Audio'],
              ['Duration', state.duration],
              ['Preview', <audio src={url} ref={ref} />],
            ]}
          />
        </>
      )}

      {type === 'network' && variables && (
        <MiniTable
          rotated
          rows={[
            ['Name', name],
            ['Type', 'Network'],
            ['Variables', variables],
          ]}
        />

      )}
    </div>
  );
};

Asset.propTypes = {
  id: PropTypes.string.isRequired,
  size: PropTypes.string,
};

Asset.defaultProps = {
  size: null,
};

export default Asset;
