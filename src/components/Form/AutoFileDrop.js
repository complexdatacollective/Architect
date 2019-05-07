import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { findKey } from 'lodash';
import { compose, withProps, withHandlers } from 'recompose';
import Dropzone from './Dropzone';
import { actionCreators as assetActions } from '../../ducks/modules/protocol/assetManifest';

const ACCEPTS = {
  network: ['text/csv', 'application/json', 'text/*,', 'text/*', '.csv'], // text/*, is a workaround for windows not correctly setting mime type for CSV.
  image: ['image/*'],
  audio: ['audio/*'],
  video: ['video/*'],
};

const getTypeFromMime = (mime) => {
  const MIME_TYPES = [
    [/text\/csv/, 'network'],
    [/application\/json/, 'network'],
    [/text\/*,/, 'network'],
    [/image\/.*/, 'image'],
    [/audio\/.*/, 'audio'],
    [/video\/.*/, 'video'],
  ];

  const match = MIME_TYPES.find(([matcher]) => matcher.test(mime));
  if (!match) { return null; }
  return match[1];
};

const getTypeFromExtension = (name) => {
  const EXTENSION_TYPES = {
    network: ['csv', 'json'], // .csv
    image: ['jpg', 'jpeg', 'gif', 'png'],
    audio: ['mp3', 'aiff'],
    video: ['mov', 'mp4'],
  };

  const extension = name.split('.').pop();

  return findKey(EXTENSION_TYPES, type => type.includes(extension));
};


const mapDispatchToProps = dispatch => ({
  importAsset: bindActionCreators(assetActions.importAsset, dispatch),
});

const autoFileDrop = compose(
  withProps(({ type }) => {
    if (!type) { return null; }

    const accepts = ACCEPTS[type];

    return { accepts };
  }),
  connect(null, mapDispatchToProps),
  withHandlers({
    onDrop: ({ importAsset, onDrop }) =>
      (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
          const type = getTypeFromMime(file.type) || getTypeFromExtension(file.name);

          importAsset(file, type)
            .then(({ id }) => {
              onDrop(id);
            });
        });
      },
  }),
);

export { autoFileDrop };

export default autoFileDrop(Dropzone);
