import React from 'react';
import { compose } from 'recompose';
import { omit, isEmpty } from 'lodash';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import PresetPreview from './PresetPreview';
import PresetFields from './PresetFields';

const normalizePreset = (values) => {
  if (isEmpty(values.groupVariable)) {
    return omit(values, ['groupVariable']);
  }
  return values;
};

const template = () => ({
  layoutVariable: null,
  groupVariable: null,
  edges: {
    display: [],
  },
  highlight: [],
});

const NarrativePresets = props => (
  <EditableList
    previewComponent={PresetPreview}
    editComponent={PresetFields}
    title="Edit Preset"
    fieldName="presets"
    template={template}
    normalize={normalizePreset}
    {...props}
  >
    <h2>Narrative Presets</h2>
    <p>
      Add one or more &quot;presets&quot; below, to encourage lines of discourse with participants.
    </p>
  </EditableList>
);

export { NarrativePresets };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
)(NarrativePresets);
