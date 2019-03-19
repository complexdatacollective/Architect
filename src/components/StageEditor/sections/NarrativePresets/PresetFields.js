/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import { getFieldId } from '../../../../utils/issues';
import { ValidatedField } from '../../../Form';
import * as ArchitectFields from '../../../Form/Fields';
import * as Fields from '../../../../ui/components/Fields';
import { Row } from '../../../OrderedList';
import withOptionsForPreset from './withOptionsForPreset';

class PresetFields extends Component {
  render() {
    const {
      layoutVariblesForNodeType,
      groupVariablesForNodeType,
      edgesForNodeType,
      highlightVariablesForNodeType,
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
            options={layoutVariblesForNodeType}
          />
        </Row>
        <Row>
          <ValidatedField
            name="groupVariable"
            component={ArchitectFields.Select}
            label="Group variable"
            options={groupVariablesForNodeType}
          />
        </Row>
        <Row>
          <Field
            name="edges.display"
            component={Fields.CheckboxGroup}
            label="Display the following edges:"
            placeholder="&mdash; Toggle an edge to display &mdash;"
            options={edgesForNodeType}
          />
        </Row>
        <Row>
          <Field
            name="highlight"
            component={Fields.CheckboxGroup}
            label="Highlight nodes with the following attribute:"
            placeholder="&mdash; Toggle a variable to highlight &mdash;"
            options={highlightVariablesForNodeType}
          />
        </Row>
      </React.Fragment>
    );
  }
}

PresetFields.propTypes = {
  layoutVariblesForNodeType: PropTypes.array,
  groupVariablesForNodeType: PropTypes.array,
  edgesForNodeType: PropTypes.array,
  highlightVariablesForNodeType: PropTypes.array,
};

PresetFields.defaultProps = {
  layoutVariblesForNodeType: [],
  groupVariablesForNodeType: [],
  edgesForNodeType: [],
  highlightVariablesForNodeType: [],
};

export { PresetFields };

export default compose(
  withOptionsForPreset,
  // withChangeGroupVariableHandler,
)(PresetFields);
