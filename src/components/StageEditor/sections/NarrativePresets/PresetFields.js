/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Field,
} from 'redux-form';
import { getFieldId } from '../../../../utils/issues';
import { ValidatedField } from '../../../Form';
import * as ArchitectFields from '../../../Form/Fields';
import * as Fields from '../../../../ui/components/Fields';
import { Row } from '../../../OrderedList';

class PresetFields extends Component {
  render() {
    const {
      layoutVariblesForNodeType,
      groupVariblesForNodeType,
      edgesForNodeType,
      highlightableForNodeType,
    } = this.props;

    return (
      <React.Fragment>
        <Row>
          <h3 id={getFieldId('text')}>Preset label</h3>
          <ValidatedField
            name="label"
            component={Fields.Text}
            label=""
            placeholder="Enter a label for the preset here"
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <ValidatedField
            name="layoutVariable"
            component={ArchitectFields.Select}
            label="Layout variable"
            placeholder="&mdash; Select a layout variable &mdash;"
            validation={{ required: true }}
            options={layoutVariblesForNodeType.map(([variableId, meta]) => (
              { value: variableId, label: meta.label }
            ))}
          />
        </Row>
        <Row>
          <ValidatedField
            name="groupVariable"
            component={ArchitectFields.Select}
            label="Layout variable"
            placeholder="&mdash; Select a group variable &mdash;"
            validation={{ required: true }}
            options={groupVariblesForNodeType.map(([variableId, meta]) => (
              { value: variableId, label: meta.label }
            ))}
          />
        </Row>
        <Row>
          <Field
            name="edges.display"
            component={Fields.CheckboxGroup}
            label="Display the following edges:"
            placeholder="&mdash; Toggle an edge to display &mdash;"
            options={edgesForNodeType.map(([variableName, meta]) => (
              { value: variableName, label: meta.label }
            ))}
          />
        </Row>
        <Row>
          <Field
            name="highlight"
            component={Fields.CheckboxGroup}
            label="Highlight nodes with the following attribute:"
            placeholder="&mdash; Toggle a variable to highlight &mdash;"
            options={highlightableForNodeType.map(([variableName, meta]) => (
              { value: variableName, label: meta.label }
            ))}
          />
        </Row>
      </React.Fragment>
    );
  }
}

PresetFields.propTypes = {
  layoutVariblesForNodeType: PropTypes.array,
  groupVariblesForNodeType: PropTypes.array,
  edgesForNodeType: PropTypes.array,
  highlightableForNodeType: PropTypes.array,
};

PresetFields.defaultProps = {
  layoutVariblesForNodeType: [],
  groupVariblesForNodeType: [],
  edgesForNodeType: [],
  highlightableForNodeType: [],
};

export { PresetFields };

export default PresetFields;
