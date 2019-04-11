import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose, withProps, withHandlers } from 'recompose';
import Dropzone from './Dropzone';
import { actionCreators as assetActions } from '../../ducks/modules/protocol/assetManifest';

const ACCEPTS = {
  network: ['text/csv', 'application/json'],
  image: ['image/*'],
  audio: ['audio/*'],
  video: ['video/*'],
};

const TYPES = [
  [/text\/csv/, 'network'],
  [/application\/json/, 'network'],
  [/image\/.*/, 'image'],
  [/audio\/.*/, 'audio'],
  [/video\/.*/, 'video'],
];

const getTypeFromMime = (mime) => {
  const match = TYPES.find(([matcher]) => matcher.test(mime));
  if (!match) { return null; }
  return match[1];
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
          const type = getTypeFromMime(file.type);

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
