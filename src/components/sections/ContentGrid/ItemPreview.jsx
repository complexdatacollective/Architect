import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Markdown } from '@codaco/ui/lib/components/Fields';
import { get } from 'lodash';
import BackgroundImageWithUrl from '../../Assets/BackgroundImage';
import VideoWithUrl from '../../Assets/Video';
import AudioWithUrl from '../../Assets/Audio';
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
