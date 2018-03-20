import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { keys, get, pick } from 'lodash';
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
    const stage = this.props.stage;

    // eslint-disable-next-line
    if (confirm('Really? this will reset everything so far!')) {
      this.props.onChange({
        ...pick(stage, ['id', 'type', 'label']),
      }, true);
    }
  }

  render() {
    const {
      stage,
      nodeTypes,
      disabled,
      onChange,
      dispatch,
      ...props
    } = this.props;

    const type = get(stage, 'subject.type');

    return (
      <Section className="stage-editor-section" {...props}>
        <Editor className="stage-editor-section__edit" disabled={disabled}>
          <div style={{ opacity: (disabled ? '0.67' : '1') }}>
            <h2>Node Type</h2>
            <p>Which type of node does this name generator create?</p>
            <OptionsInput
              options={nodeTypes}
              component={NodeTypeOption}
              value={type}
              onChange={value => onChange({ subject: { entity: 'node', type: value } })}
            />
          </div>
          { disabled &&
            <div style={{ 'pointer-events': 'auto' }}>
              <Button onClick={() => this.resetStage()}>Change Node Type</Button>
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
  stage: PropTypes.object,
  nodeTypes: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
};

NodeType.defaultProps = {
  stage: {},
  nodeTypes: [],
  disabled: false,
  onChange: () => {},
};

const mapStateToProps = (state, props) => ({
  nodeTypes: keys(state.protocol.present.variableRegistry.node),
  disabled: !!get(props, 'stage.nodeType'),
});

export { NodeType };

export default connect(
  mapStateToProps,
)(NodeType);
