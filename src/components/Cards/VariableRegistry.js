import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { map, has, get } from 'lodash';
import { TransitionGroup } from 'react-transition-group';
import { Wipe } from '../Transitions';
import { Node, Button } from '../../ui/components';
import { Guided } from '../Guided';
import Guidance from '../Guidance';
import Card from '../Card';
import EdgeIcon from '../EdgeIcon';
import { getProtocol } from '../../selectors/protocol';
import { makeGetUsageForType } from '../../selectors/variableRegistry';
import { actionCreators as variableRegistryActions } from '../../ducks/modules/protocol/variableRegistry';

const Type = ({ label, link, children, usage, handleDelete }) => (
  <div className="list__item">
    <div className="list__attribute list__attribute--icon">
      <Link to={link}>
        {children}
      </Link>
    </div>
    <div className="list__attribute">
      <h3>
        <Link to={link}>
          {label}
        </Link>
      </h3>
      { usage.length === 0 && <div className="list__tag">unused</div> }
    </div>
    <div className="list__attribute list__attribute--options">
      <Button size="small" color="neon-coral" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  </div>
);

Type.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  usage: PropTypes.array,
  handleDelete: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

Type.defaultProps = {
  usage: [],
};

/**
 * This component acts as an index for types. i.e. Nodes and Edges,
 * and links to the EditType.
 */
class VariableRegistry extends Component {
  get buttons() {
    return [
      <Button key="cancel" size="small" color="platinum" onClick={this.handleCancel}>Back</Button>,
    ];
  }

  handleDelete = (entity, type) => {
    const usage = this.props.getUsageForType(entity, type);
    const deletedObjects = usage.reduce(
      (memo, { owner }) => (
        owner.type === 'prompt' ?
          `${memo}\n    stage prompt: ${owner.stageId}: ${owner.promptId}` :
          `${memo}\n    ${owner.type}: ${owner.id}`
      ),
      '',
    );

    const confirmMessage = `Are you sure you want to delete "${type} ${entity}" ${
      usage.length > 0 ?
        `\n\nBecause a number of other objects depend on this type, they will also be removed: \n${deletedObjects}` :
        ''
    }`;

    // eslint-disable-next-line no-alert
    if (!confirm(confirmMessage)) { return; }

    this.props.deleteType(entity, type, true);
  };

  handleCancel = this.props.onComplete;

  renderNode = (node, key) => {
    const nodeColor = get(node, 'color', '');
    const usage = this.props.getUsageForType('node', key);

    return (
      <Wipe key={key}>
        <Type
          link={`${this.props.protocolPath}/registry/node/${key}`}
          label={node.label}
          handleDelete={() => this.handleDelete('node', key)}
          usage={usage}
        >
          <Node label="" color={nodeColor} />
        </Type>
      </Wipe>
    );
  }

  renderEdge = (edge, key) => {
    const edgeColor = `var(--${get(edge, 'color', '')})`;
    const usage = this.props.getUsageForType('edge', key);

    return (
      <Wipe key={key}>
        <Type
          link={`${this.props.protocolPath}/registry/edge/${key}`}
          label={edge.label}
          handleDelete={() => this.handleDelete('edge', key)}
          usage={usage}
        >
          <EdgeIcon color={edgeColor} />
        </Type>
      </Wipe>
    );
  }

  renderEdges() {
    const edges = get(this.props.variableRegistry, 'edge', {});

    if (edges.length === 0) {
      return 'No node types defined';
    }

    return (
      <div className="list">
        <TransitionGroup>
          {map(edges, this.renderEdge)}
        </TransitionGroup>
      </div>
    );
  }

  renderNodes() {
    const nodes = get(this.props.variableRegistry, 'node', {});

    if (nodes.length === 0) {
      return 'No node types defined';
    }

    return (
      <div className="list">
        <TransitionGroup>
          {map(nodes, this.renderNode)}
        </TransitionGroup>
      </div>
    );
  }

  render() {
    const {
      show,
      protocolPath,
    } = this.props;

    return (
      <Card
        show={show}
        buttons={this.buttons}
        onAcknowledgeError={this.handleCancel}
      >
        <div className="editor variable-registry">
          <Guided className="editor__sections">
            <h1>Variable Registry</h1>

            <Guidance contentId="guidance.registry.nodes">
              <div className="editor__section">
                <h2>Node Types</h2>
                <div className="editor__subsection">
                  {this.renderNodes()}
                </div>
                { protocolPath &&
                  <div className="editor__subsection">
                    <Link
                      to={`${protocolPath}/registry/node/`}
                      className="button button--small"
                    >
                      Create new Node type
                    </Link>
                  </div>
                }
              </div>
            </Guidance>

            <Guidance contentId="guidance.registry.edges">
              <div className="editor__section">
                <h2>Edge Types</h2>
                <div className="editor__subsection">
                  {this.renderEdges()}
                </div>
                <div className="editor__subsection">
                  { protocolPath &&
                    <Link
                      to={`${protocolPath}/registry/edge/`}
                      className="button button--small"
                    >
                      Create new Edge type
                    </Link>
                  }
                </div>
              </div>
            </Guidance>
          </Guided>
        </div>
      </Card>
    );
  }
}

VariableRegistry.propTypes = {
  show: PropTypes.bool,
  variableRegistry: PropTypes.shape({
    node: PropTypes.object.isRequired,
    edge: PropTypes.object.isRequired,
  }).isRequired,
  getUsageForType: PropTypes.func.isRequired,
  protocolPath: PropTypes.string,
  onComplete: PropTypes.func,
  deleteType: PropTypes.func.isRequired,
};

VariableRegistry.defaultProps = {
  protocolPath: null,
  variableRegistry: {
    node: {},
    edge: {},
  },
  show: true,
  onComplete: () => {},
};

const mapStateToProps = (state, props) => {
  const protocol = getProtocol(state);
  const variableRegistry = protocol.variableRegistry;
  const getUsageForType = makeGetUsageForType(state);

  return {
    variableRegistry,
    getUsageForType,
    protocolPath: has(props, 'match.params.protocol') ?
      `/edit/${get(props, 'match.params.protocol')}` : null,
  };
};

const mapDispatchToProps = dispatch => ({
  deleteType: bindActionCreators(variableRegistryActions.deleteType, dispatch),
});

export { VariableRegistry };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VariableRegistry);
