import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { get, keys } from 'lodash';
import { compose } from 'recompose';
import { SeamlessText } from '../../Form/Fields';
import { Tweened } from '../../../behaviours/Tweened';
import { Node, Icon } from '../../../ui';
import { actionCreators as protocolActions } from '../../../ducks/modules/protocol';
import PanelGroup from './PanelGroup';

class Overview extends Component {
  get renderNodeTypes() {
    const nodeTypes = keys(get(this.props.variableRegistry, 'node', {}));

    if (nodeTypes.length === 0) {
      return 'No node types defined';
    }

    return nodeTypes.map(
      (node, index) => {
        const nodeColor = `node-color-seq-${index + 1}`;
        return <Node label={node} key={index} color={nodeColor} />;
      },
    );
  }

  get renderEdgeTypes() {
    const edgeTypes = keys(get(this.props.variableRegistry, 'edge', {}));

    if (edgeTypes.length === 0) {
      return 'No edge types defined';
    }

    const temporaryEdgeColors = [
      'mustard',
      'purple-pizazz',
      'neon-coral',
      'kiwi',
      'paradise-pink',
      'tomato',
      'sea-serpent',
      'barbie-pink',
      'neon-coral',
      'cerulean-blue',
    ];

    return edgeTypes.map(
      (edge, index) => {
        const edgeColor = temporaryEdgeColors[index];
        return <Icon name="links" label={edge} key={index} color={edgeColor} />;
      },
    );
  }

  render() {
    const {
      name,
      version,
      updateOptions,
    } = this.props;

    return (
      <div className="timeline-overview">
        <form>
          <div className="timeline-overview__panel">
            <div className="timeline-overview__content">
              <SeamlessText
                className="timeline-overview__name"
                input={{
                  value: name,
                  onChange: ({ target: { value } }) => { updateOptions({ name: value }); },
                }}
              />
              <div className="timeline-overview__groups">
                <PanelGroup title="Variable registry">
                  <br />
                  <h4>Node types</h4>
                  { this.renderNodeTypes }
                  <br />
                  <h4>Edge types</h4>
                  { this.renderEdgeTypes }
                </PanelGroup>
                <PanelGroup title="Forms">
                  <p>Forms not displayed yet.</p>
                </PanelGroup>
                <PanelGroup title="Global Options">
                  <p>Version: {version}</p>
                </PanelGroup>
                <PanelGroup title="Assets">
                  <p>Assets not displayed yet.</p>
                </PanelGroup>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

Overview.propTypes = {
  name: PropTypes.string,
  version: PropTypes.string,
  forms: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  variableRegistry: PropTypes.object,
  externalData: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  updateOptions: PropTypes.func,
};

Overview.defaultProps = {
  name: '',
  version: '',
  forms: {},
  variableRegistry: {},
  externalData: {},
  updateOptions: () => {},
};

const mapDispatchToProps = dispatch => ({
  updateOptions: bindActionCreators(protocolActions.updateOptions, dispatch),
});

export default compose(
  connect(null, mapDispatchToProps),
  withRouter,
  Tweened({
    tweenName: 'protocol',
    tweenElement: 'overview-panel',
  }),
)(Overview);
