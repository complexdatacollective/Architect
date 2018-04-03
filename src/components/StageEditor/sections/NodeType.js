import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, getFormValues, change as changeField } from 'redux-form';
import PropTypes from 'prop-types';
import { keys, get, difference } from 'lodash';
import { Section, Editor, Guidance } from '../../Guided';
import { Button } from '../../../components/Form';
import Contexts from '../../../components/Form/Fields/Contexts';

class NodeType extends Component {
  resetStage() {
    const { stage, resetField } = this.props;
    // eslint-disable-next-line
    if (confirm('Really? this will reset everything so far!')) {
      const fieldsToReset = difference(keys(stage), ['id', 'type', 'label']);

      fieldsToReset.forEach(resetField);
    }
  }

  render() {
    const {
      nodeTypes,
      disabled,
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
              component={Contexts}
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
  disabled: PropTypes.bool,
  stage: PropTypes.object.isRequired,
  resetField: PropTypes.func.isRequired,
};

NodeType.defaultProps = {
  nodeTypes: [],
  disabled: false,
};

const mapStateToProps = (state, { form }) => {
  const stage = getFormValues(form.name)(state);

  return {
    nodeTypes: keys(state.protocol.present.variableRegistry.node),
    disabled: !!get(stage, 'subject.type'),
    stage,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  resetField: field => dispatch(changeField(form.name, field, null)),
});

export { NodeType };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NodeType);
