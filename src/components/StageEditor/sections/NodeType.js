/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, getFormValues, change as changeField } from 'redux-form';
import PropTypes from 'prop-types';
import { keys, get, pick, difference } from 'lodash';
import { Section, Editor, Guidance } from '../../Guided';
import { OptionsInput, Button } from '../../../components/Form';

// eslint-disable-next-line
const NodeTypeOption = ({ selected, value }) => (
  <div className="edit-stage-node-type__option">
    {value} {selected && ' (selected)'}
  </div>
);

class NodeType extends Component {
  resetStage() {
    // eslint-disable-next-line
    if (confirm('Really? this will reset everything so far!')) {
      const fieldsToReset = difference(keys(this.props.stage), ['id', 'type', 'label']);

      fieldsToReset.forEach((field) => {
        this.props.resetField(field);
      });
    }
  }

  render() {
    const {
      nodeTypes,
      disabled,
      onChange
    } = this.props;

    return (
      <Section className="stage-editor-section">
        <Editor className="stage-editor-section__edit" disabled={disabled}>
          <div style={{ opacity: (disabled ? '0.67' : '1') }}>
            <h2>Node Type</h2>
            <p>Which type of node does this name generator create?</p>
            <Field
              name="subject"
              parse={value => ({ type: value, entity: 'node' })}
              format={value => get(value, 'type')}
              options={nodeTypes}
              component={OptionsInput}
              optionComponent={NodeTypeOption}
            />
          </div>
          { disabled &&
            <div style={{ 'pointer-events': 'auto' }}>
              <Button type="button" onClick={() => this.resetStage()}>Change Node Type</Button>
            </div>
          }
        </Editor>
        <Guidance className="stage-editor-section__guidance">
          What kind of nodes do you want to study?
        </Guidance>
      </Section>
    );
  }
}

NodeType.propTypes = {
  nodeTypes: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

NodeType.defaultProps = {
  nodeTypes: [],
  disabled: false,
  onChange: () => {},
};

const mapStateToProps = (state, props) => {
  const stage = getFormValues('edit-stage')(state);
  return {
    nodeTypes: keys(state.protocol.present.variableRegistry.node),
    disabled: !!get(stage, 'subject.type'),
    stage,
  };
}

const mapDispatchToProps = (dispatch) => ({
  resetField: (field) => dispatch(changeField('edit-stage', field, null)),
});

export { NodeType };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeType);
