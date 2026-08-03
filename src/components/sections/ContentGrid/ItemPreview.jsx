import { get } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Markdown } from '@codaco/ui/lib/components/Fields';

import { getAssetManifest } from '../../../selectors/protocol';
import AudioWithUrl from '../../Assets/Audio';
import BackgroundImageWithUrl from '../../Assets/BackgroundImage';
import VideoWithUrl from '../../Assets/Video';

const mapStateToProps = (state, { content }) => {
  const assetManifest = getAssetManifest(state);

  const assetType = get(assetManifest, [content, 'type']);

  return {
    assetType,
  };
};

const ItemPreview = ({ content, assetType }) => {
  switch (assetType) {
    case 'image':
      return <BackgroundImageWithUrl id={content} />;
    case 'video':
      return <VideoWithUrl id={content} controls />;
    case 'audio':
      return <AudioWithUrl id={content} controls />;
    default:
      return <Markdown label={content} />;
  }
};

ItemPreview.propTypes = {
  content: PropTypes.string,
  assetType: PropTypes.string,
};

ItemPreview.defaultProps = {
  content: null,
  assetType: null,
};

export default connect(mapStateToProps)(ItemPreview);
