import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { has, each } from 'lodash';
import { compose, withProps, withHandlers } from 'recompose';
import Dropzone from './Dropzone';
import { SUPPORTED_MIME_TYPE_MAP, SUPPORTED_EXTENSION_TYPE_MAP } from '../../config';
import { actionCreators as assetActions } from '../../ducks/modules/protocol/assetManifest';

const mapDispatchToProps = dispatch => ({
  importAsset: bindActionCreators(assetActions.importAsset, dispatch),
});

const autoFileDrop = compose(
  withProps(({ type }) => {
    // Handle no 'type' required - still enforce only allowing supported file types
    if (!type || !has(SUPPORTED_EXTENSION_TYPE_MAP, type)) {
      const consolidatedList = [];
      each(SUPPORTED_EXTENSION_TYPE_MAP, (value, key) => {
        consolidatedList.push(...value, ...SUPPORTED_MIME_TYPE_MAP[key]);
      });
      return { accepts: consolidatedList };
    }

    return {
      accepts: [
        ...SUPPORTED_MIME_TYPE_MAP[type],
        ...SUPPORTED_EXTENSION_TYPE_MAP[type],
      ],
    };
  }),
  connect(null, mapDispatchToProps),
  withHandlers({
    onDrop: ({ importAsset, onDrop }) =>
      filePaths =>
        Promise.all(
          filePaths.map(
            filePath =>
              importAsset(filePath)
                .then(({ id }) => id),
          ),
        )
          .then(ids => onDrop(ids)),
  }),
);

export { autoFileDrop };

export default autoFileDrop(Dropzone);
