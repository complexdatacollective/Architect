import { connect } from 'react-redux';
import { has, each } from 'lodash';
import { compose, withProps, withHandlers, withState } from 'recompose';
import Dropzone from './Dropzone';
import { SUPPORTED_MIME_TYPE_MAP, SUPPORTED_EXTENSION_TYPE_MAP } from '../../config';
import importAsset, { validateAsset } from '@app/other/protocols/importAsset';
import { getActiveProtocolMeta } from '@selectors/protocol';
import { actionCreators as assetActions } from '../../ducks/modules/protocol/assetManifest';

const mapStateToProps = state => ({
  workingPath: getActiveProtocolMeta(state).workingPath,
});

const mapDispatchToProps = {
  importAsset: assetActions.importAsset,
};

const autoFileDrop = compose(
  withState('disabled', 'setDisabled', false),
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
  connect(mapStateToProps, mapDispatchToProps),
);

export { autoFileDrop };

export default autoFileDrop(Dropzone);
