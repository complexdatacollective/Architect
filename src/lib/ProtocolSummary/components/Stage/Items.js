import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import useAssetData from '../useAssetData';
import MiniTable from '../MiniTable';

const Text = ({ content }) => <ReactMarkdown source={content} />;

const Asset = ({ content }) => {
  const {
    url,
    type,
    name,
  } = useAssetData(content);

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

  switch (type) {
    case 'image':
      return <img src={url} alt={name} />;
    case 'video':
      return (
        <>
          <video src={url} ref={ref} />
          <MiniTable
            rows={[
              [<strong>Name</strong>, name],
              [<strong>Duration</strong>, state.duration],
            ]}
          />
        </>
      );
    case 'audio':
      return (
        <>
          <audio src={url} ref={ref} />
          <MiniTable
            rows={[
              [<strong>Name</strong>, name],
              [<strong>Duration</strong>, state.duration],
            ]}
          />
        </>
      );
    default:
      return `"${content}":"${type}" type not supported.`;
  }
};

const Items = ({ items }) => {
  if (!items) { return null; }

  return (
    <div className="protocol-summary-stage__items">
      <h2>Content</h2>
      <div className="protocol-summary-stage__items-content">
        {items.map(({ type, content }) => {
          switch (type) {
            case 'asset':
              return (
                <div className="protocol-summary-stage__items-item">
                  <Asset content={content} />
                </div>
              );
            default:
              return (
                <div className="protocol-summary-stage__items-item--text">
                  <Text content={content} />
                </div>
              );
          }
        })}
      </div>
    </div>
  );
};

Items.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      content: PropTypes.string,
      size: PropTypes.string,
    }),
  ),
};

Items.defaultProps = {
  items: null,
};

export default Items;
