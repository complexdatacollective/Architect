import React from 'react';
import { withProps, compose } from 'recompose';
import { omit, isEmpty } from 'lodash';
import PresetPreview from './PresetPreview';
import PresetFields from './PresetFields';
import EditableList, { withSubjectNodeType } from '../../../EditableList';

const narrativePresetTemplate = {
  layoutVariable: null,
  groupVariable: null,
  edges: {
    display: [],
  },
  highlight: [],
};

const normalizePreset = (values) => {
  if (!isEmpty(values.groupVariable)) {
    return omit(values, ['groupVariable']);
  }
  return values;
};

const NarrativePresets = props => (
  <EditableList
    contentId="guidance.editor.narrative_presets"
    previewComponent={PresetPreview}
    editComponent={PresetFields}
    title="Edit Preset"
    fieldName="presets"
    template={narrativePresetTemplate}
    normalize={normalizePreset}
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
