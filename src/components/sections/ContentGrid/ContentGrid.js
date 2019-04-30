import React from 'react';
import Grid from '../../Grid';
import ItemPreview from './ItemPreview';
import ItemEditor from './ItemEditor';
import { capacity } from './options';

const ContentGrid = props => (
  <Grid
    contentId="guidance.editor.content_items"
    previewComponent={ItemPreview}
    editComponent={ItemEditor}
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
      Larger items will take up more the 4 slots available.
    </p>
  </Grid>
);

export { ContentGrid };

export default ContentGrid;
