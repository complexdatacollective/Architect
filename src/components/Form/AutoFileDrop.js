import { SUPPORTED_EXTENSION_TYPE_MAP } from '@app/config';
import { actionCreators as assetActions } from '@modules/protocol/assetManifest';
import { has } from 'lodash';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { bindActionCreators } from 'redux';

import Dropzone from './Dropzone';

const mapDispatchToProps = (dispatch) => ({
  importAsset: bindActionCreators(assetActions.importAsset, dispatch),
});

const autoFileDrop = compose(
  withProps(({ type }) => {
    // Handle no 'type' required - still enforce only allowing supported file types
    if (!type || !has(SUPPORTED_EXTENSION_TYPE_MAP, type)) {
      const consolidatedList = [].concat(
        ...Object.values(SUPPORTED_EXTENSION_TYPE_MAP),
      );
      return { accepts: consolidatedList };
    }

    return {
      accepts: [...SUPPORTED_EXTENSION_TYPE_MAP[type]],
    };
  }),
  connect(null, mapDispatchToProps),
  withHandlers({
    onDrop:
      ({ importAsset, onDrop }) =>
      (filePaths) =>
        Promise.all(
          filePaths.map((filePath) =>
            importAsset(filePath).then(({ id }) => id),
          ),
        ).then((ids) => onDrop(ids)),
  }),
);

export default autoFileDrop(Dropzone);
