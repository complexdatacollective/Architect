import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import Dropzone from './Dropzone';
import { actionCreators as assetActions } from '../../ducks/modules/protocol/assetManifest';

const mapDispatchToProps = dispatch => ({
  importAsset: bindActionCreators(assetActions.importAsset, dispatch),
});

const autoFileDrop = compose(
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
