import React from 'react';
import { formValueSelector } from 'redux-form';
import { get } from 'lodash';
import Grid from '../../Grid';
import ItemPreview from './ItemPreview';
import ItemEditor from './ItemEditor';
import { capacity } from './options';
import { getAssetManifest } from '../../../selectors/protocol';

const normalizeType = item => ({
  ...item,
  type: item.type === 'text' ? 'text' : 'asset',
});

const denormalizeType = (state, { form, editField }) => {
  const item = formValueSelector(form)(state, editField);

  if (!item) { return null; }

  if (item.type === 'text') { return item; }

  const assetManifest = getAssetManifest(state);
  const manifestType = get(assetManifest, [item.content, 'type']);

  return {
    ...item,
    type: manifestType,
  };
};

const ContentGrid = props => (
  <Grid
    contentId="guidance.editor.content_items"
    previewComponent={ItemPreview}
    editComponent={ItemEditor}
    normalize={normalizeType}
    itemSelector={denormalizeType}
    title="Edit Items"
    capacity={capacity}
    {...props}
  >
    <h2>Edit Items</h2>
    <p>
      Add up to 4 &quot;items&quot; below.
    </p>
    <p>
      Items can be resized by dragging.
    </p>
    <p>
      Available sizes are: Small (1 space), Medium (2 spaces) and large (4 spaces).
    </p>
  </Grid>
);

export { ContentGrid };

export default ContentGrid;
