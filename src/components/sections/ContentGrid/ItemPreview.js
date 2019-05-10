import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { BackgroundImage, Video, Audio } from '../../Assets';
import { getAssetManifest } from '../../../selectors/protocol';

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
      return <BackgroundImage id={content} />;
    case 'video':
      return <Video id={content} controls />;
    case 'audio':
      return <Audio id={content} controls />;
    default:
      return <Markdown source={content} />;
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

export { ItemPreview };

export default connect(mapStateToProps)(ItemPreview);
