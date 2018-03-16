import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { keys } from 'lodash';
import { Section, Editor, Guidance } from '../../Guided';
import { OptionsInput, Button } from '../../../components/Form';

// eslint-disable-next-line
const NodeTypeOption = ({ selected, value }) => (
  <div className="edit-stage-node-type__option">
    {value} {selected && ' (selected)'}
  </div>
);

const NodeType = ({ stage: { nodeType }, nodeTypes, onChange, dispatch, ...props }) => {
  const disabled = !!nodeType;

  return (
    <Section className="stage-editor-section" {...props}>
      <Editor className="stage-editor-section__edit" disabled={disabled}>
        <div style={{ opacity: disabled ? '0.67' : 'none' }}>
          <h2>Node Type</h2>
          <p>Which type of node does this name generator create?</p>
          <OptionsInput
            options={nodeTypes}
            component={NodeTypeOption}
            value={nodeType}
            onChange={value => onChange({ nodeType: value })}
          />
        </div>
        { disabled &&
          <div style={{ 'pointer-events': 'auto' }}>
            <Button onClick={() => alert('test')}>Change Node Type</Button>
          </div>
        }
      </Editor>
      <Guidance className="stage-editor-section__guidance">
        What kind of nodes do you want to study?
      </Guidance>
    </Section>
  );
};

NodeType.propTypes = {
  stage: PropTypes.object,
  nodeTypes: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
};

NodeType.defaultProps = {
  stage: {},
  nodeTypes: [],
  onChange: () => {},
};

const mapStateToProps = state => ({
  nodeTypes: keys(state.protocol.present.variableRegistry.node),
});

export { NodeType };

export default connect(
  mapStateToProps,
)(NodeType);
