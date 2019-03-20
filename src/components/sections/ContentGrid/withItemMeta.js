import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { get } from 'lodash';

// TODO: move to selectors
const getAssetManifest = state =>
  get(state, 'protocol.present.assetManifest', {});

const mapStateToProps = (state, { fieldId, form }) => {
  const field = formValueSelector(form)(state, `${fieldId}`);

  if (!field) { return {}; }

  if (field.type !== 'asset') {
    return { item: field };
  }

  const assetManifest = getAssetManifest(state);
  const itemMeta = get(assetManifest, field.content, {});
  const item = {
    ...field,
    ...itemMeta,
    content: itemMeta.source,
  };

  return {
    item,
  };
};

const withItemMeta = connect(
  mapStateToProps,
);

export default withItemMeta;
