import React, { useEffect, useRef, useState } from 'react';
import useAssetData from './useAssetData';
import MiniTable from './MiniTable';

const Asset = ({ id }) => {
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
      <h4>{name}</h4>

      {type === 'image' && (
        <div className="protocol-summary-asset-manifest__asset-media">
          <img src={url} alt={name} />
        </div>
      )}

      {type === 'video' && (
        <>
          <div className="protocol-summary-asset-manifest__asset-media">
            <video src={url} ref={ref} />
          </div>
          <MiniTable
            rows={[
              [<strong>Name</strong>, name],
              [<strong>Duration</strong>, state.duration],
            ]}
          />
        </>
      )}

      {type === 'audio' && (
        <>
          <audio src={url} ref={ref} />
          <MiniTable
            rows={[
              [<strong>Name</strong>, name],
              [<strong>Duration</strong>, state.duration],
            ]}
          />
        </>
      )}

      {type === 'network' && variables && (
        <MiniTable
          wide
          lite
          rows={
            [
              [<strong>Variables</strong>],
              ...variables,
            ]
          }
        />
      )}
    </div>
  );
};

export default Asset;
