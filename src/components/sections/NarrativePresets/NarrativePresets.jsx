import { isEmpty, omit } from 'lodash';
import { compose } from 'recompose';

import EditableList from '../../EditableList';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withSubject from '../../enhancers/withSubject';
import PresetFields from './PresetFields';
import PresetPreview from './PresetPreview';

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

const NarrativePresets = (props) => (
  <EditableList
    previewComponent={PresetPreview}
    editComponent={PresetFields}
    title="Edit Preset"
    fieldName="presets"
    template={template}
    normalize={normalizePreset}
    sectionTitle="Narrative Presets"
    sectionSummary={
      <p>
        Add one or more &quot;presets&quot; below, to create different
        visualizations that you can switch between within the interview.
      </p>
    }
    {...props}
  />
);

export default compose(
  withSubject,
  withDisabledSubjectRequired,
)(NarrativePresets);
