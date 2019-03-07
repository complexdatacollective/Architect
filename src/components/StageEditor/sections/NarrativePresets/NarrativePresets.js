import React from 'react';
import { withProps, compose } from 'recompose';
import PresetPreview from './PresetPreview';
import PresetFields from './PresetFields';
import EditableList, { withSubjectNodeType } from '../../../EditableList';

const NarrativePresets = props => (
  <EditableList
    contentId="guidance.editor.narrative_presets"
    previewComponent={PresetPreview}
    editComponent={PresetFields}
    title="Edit Preset"
    fieldName="presets"
    {...props}
  >
    <h2>Narrative Presets</h2>
    <p>
      Add one or more &quot;presets&quot; below, to ecourage lines of discourse with participants.
    </p>
  </EditableList>
);

export { NarrativePresets };

export default compose(
  withSubjectNodeType,
  withProps(({ nodeType }) => ({ disabled: !nodeType })),
)(NarrativePresets);
