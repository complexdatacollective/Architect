import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose, withProps, withHandlers } from 'recompose';
import Dropzone from './Dropzone';
import { actionCreators as assetActions } from '../../ducks/modules/protocol/assetManifest';

const ACCEPTS = {
  network: ['text/csv', 'application/json', 'text/*,', 'text/*', '.csv'], // text/*, is a workaround for windows not correctly setting mime type for CSV.
  image: ['image/*'],
  audio: ['audio/*'],
  video: ['video/*'],
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
          importAsset(file)
            .then(({ id }) => {
              onDrop(id);
            });
        });
      },
  }),
);

export { autoFileDrop };

export default autoFileDrop(Dropzone);
