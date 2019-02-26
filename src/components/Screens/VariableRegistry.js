import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { map, get } from 'lodash';
import { TransitionGroup } from 'react-transition-group';
import { Wipe } from '../Transitions';
import { Node, Button, Icon } from '../../ui/components';
import { Guided } from '../Guided';
import Guidance from '../Guidance';
import Card from '../Card';
import Link from '../Link';
import { getProtocol } from '../../selectors/protocol';
import { makeGetUsageForType, makeGetDeleteImpact, makeGetObjectLabel } from '../../selectors/variableRegistry';
import { actionCreators as variableRegistryActions } from '../../ducks/modules/protocol/variableRegistry';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';

const Type = ({ label, category, type, children, usage, handleDelete }) => (
  <div className="simple-list__item">
    <div className="simple-list__attribute simple-list__attribute--icon">
      <Link
        screen="type"
        params={{ category, type }}
      >
        {children}
      </Link>
    </div>
    <div className="simple-list__attribute">
      <h3>
        <Link
          screen="type"
          params={{ category, type }}
        >
          {label}
        </Link>
      </h3>
      { usage.length === 0 && <div className="simple-list__tag">unused</div> }
    </div>
    <div className="simple-list__attribute simple-list__attribute--options">
      <Button size="small" color="neon-coral" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  </div>
);

Type.propTypes = {
  label: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  type: PropTypes.string,
  usage: PropTypes.array,
  handleDelete: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

Type.defaultProps = {
  usage: [],
  type: null,
};

/**
 * This component acts as an index for types. i.e. Nodes and Edges,
 * and links to the EditType.
 */
class VariableRegistry extends Component {
  get buttons() {
    return [
      <Button key="cancel" color="platinum" onClick={this.handleCancel}>Back</Button>,
    ];
  }

  handleDelete = (entity, type) => {
    const deletedObjects = this.props.getDeleteImpact(entity, type);
    const typeName = this.props.variableRegistry[entity][type].name;

    const confirmMessage = (
      <Fragment>
        <p>Are you sure you want to delete {typeName} {entity}?</p>
        { deletedObjects.length > 0 &&
          <Fragment>
            <p>Because a number of other objects depend on this type, they will also be removed:</p>
            <ul>
              {deletedObjects.map(
                item =>
                  <li>{item.type.toUpperCase()}: {this.props.getObjectLabel(item)}</li>,
              )}
            </ul>
          </Fragment>
        }
      </Fragment>
    );

    this.props.openDialog({
      type: 'Warning',
      title: `Delete ${typeName} ${entity}`,
      message: confirmMessage,
      onConfirm: () => { this.props.deleteType(entity, type, true); },
      confirmLabel: `Delete ${typeName} ${entity}`,
    });
  };

  handleCancel = this.props.onComplete;

  renderNode = (node, type) => {
    const nodeColor = get(node, 'color', '');
    const usage = this.props.getUsageForType('node', type);

    return (
      <Wipe key={type}>
        <Type
          category="node"
          type={type}
          label={node.label}
          handleDelete={() => this.handleDelete('node', type)}
          usage={usage}
        >
          <Node label="" color={nodeColor} />
        </Type>
      </Wipe>
    );
  }

  renderEdge = (edge, type) => {
    const edgeColor = get(edge, 'color', '');
    const usage = this.props.getUsageForType('edge', type);

    return (
      <Wipe key={type}>
        <Type
          category="edge"
          type={type}
          label={edge.label}
          handleDelete={() => this.handleDelete('edge', type)}
          usage={usage}
        >
          <Icon name="links" color={edgeColor} />
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
      <div className="simple-list">
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
      <div className="simple-list">
        <TransitionGroup>
          {map(nodes, this.renderNode)}
        </TransitionGroup>
      </div>
    );
  }

  render() {
    const {
      show,
      state,
    } = this.props;

    return (
      <Card
        show={show}
        state={state}
        buttons={this.buttons}
        onAcknowledgeError={this.handleCancel}
      >
        <Guided>
          <div className="editor variable-registry">
            <div className="editor__window">
              <div className="editor__content">
                <h1 className="editor__heading">Variable Registry</h1>
                <p>
                  Use this screen to create, edit, and manage your node and edge types.
                </p>
                <Guidance contentId="guidance.registry.nodes">
                  <div className="editor__section">
                    <h2>Node Types</h2>
                    <div className="editor__subsection">
                      {this.renderNodes()}
                    </div>
                    <div className="editor__subsection">
                      <Link
                        screen="type"
                        params={{ category: 'node' }}
                      >
                        <Button size="small" icon="add">
                          Create new Node type
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Guidance>

                <Guidance contentId="guidance.registry.edges">
                  <div className="editor__section">
                    <h2>Edge Types</h2>
                    <div className="editor__subsection">
                      {this.renderEdges()}
                    </div>
                    <div className="editor__subsection">
                      <Link
                        screen="type"
                        params={{ category: 'edge' }}
                      >
                        <Button size="small" icon="add">
                          Create new Edge type
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Guidance>
              </div>
            </div>
          </div>
        </Guided>
      </Card>
    );
  }
}

VariableRegistry.propTypes = {
  show: PropTypes.bool,
  state: PropTypes.object,
  variableRegistry: PropTypes.shape({
    node: PropTypes.object.isRequired,
    edge: PropTypes.object.isRequired,
  }).isRequired,
  getUsageForType: PropTypes.func.isRequired,
  onComplete: PropTypes.func,
  deleteType: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  getDeleteImpact: PropTypes.func.isRequired,
  getObjectLabel: PropTypes.func.isRequired,
};

VariableRegistry.defaultProps = {
  variableRegistry: {
    node: {},
    edge: {},
  },
  show: true,
  state: null,
  onComplete: () => {},
};

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);
  const variableRegistry = protocol.variableRegistry;
  const getUsageForType = makeGetUsageForType(state);
  const getDeleteImpact = makeGetDeleteImpact(state);
  const getObjectLabel = makeGetObjectLabel(state);

  return {
    variableRegistry,
    getUsageForType,
    getDeleteImpact,
    getObjectLabel,
  };
};

const mapDispatchToProps = dispatch => ({
  deleteType: bindActionCreators(variableRegistryActions.deleteType, dispatch),
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

export { VariableRegistry };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VariableRegistry);
