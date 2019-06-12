import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { map, get } from 'lodash';
import { TransitionGroup } from 'react-transition-group';
import { Wipe } from '../Transitions';
import { Node, Button, Icon } from '../../ui/components';
import { Guided } from '../Guided';
import Guidance from '../Guidance';
import Screen from '../Screen/Screen';
import { getProtocol } from '../../selectors/protocol';
import { getNodeIndex, getEdgeIndex, utils } from '../../selectors/indexes';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';

const Type = ({ label, children, used, handleDelete }) => (
  <div className="simple-list__item">
    <div className="simple-list__attribute simple-list__attribute--icon">
      {children}
    </div>
    <div className="simple-list__attribute">
      <h3>
        {label}
      </h3>
      { !used && <div className="simple-list__tag">unused</div> }
    </div>
    { !used &&
      <div className="simple-list__attribute simple-list__attribute--options">
        <Button size="small" color="neon-coral" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    }
  </div>
);

Type.propTypes = {
  label: PropTypes.string.isRequired,
  used: PropTypes.boolean,
  handleDelete: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

Type.defaultProps = {
  used: false,
};

/**
 * This component acts as an index for types. i.e. Nodes and Edges,
 * and links to the EditType.
 */
class Codebook extends Component {
  handleDelete = (entity, type) => {
    const typeName = this.props.codebook[entity][type].name;

    this.props.openDialog({
      type: 'Warning',
      title: `Delete ${typeName} ${entity}`,
      message: (
        <p>
          Are you sure you want to delete the {entity} called {typeName}? This cannot be undone.
        </p>
      ),
      onConfirm: () => { this.props.deleteType(entity, type, true); },
      confirmLabel: `Delete ${typeName} ${entity}`,
    });
  };

  handleCancel = this.props.onComplete;

  renderNode = (node, type) => {
    const nodeColor = get(node, 'color', '');
    const used = this.props.nodeUsageIndex.has(type);

    return (
      <Wipe key={type}>
        <Type
          category="node"
          type={type}
          label={node.name}
          handleDelete={() => this.handleDelete('node', type)}
          used={used}
        >
          <Node label="" color={nodeColor} />
        </Type>
      </Wipe>
    );
  }

  renderEdge = (edge, type) => {
    const edgeColor = get(edge, 'color', '');
    const used = this.props.edgeUsageIndex.has(type);

    return (
      <Wipe key={type}>
        <Type
          category="edge"
          type={type}
          label={edge.name}
          handleDelete={() => this.handleDelete('edge', type)}
          used={used}
        >
          <Icon name="links" color={edgeColor} />
        </Type>
      </Wipe>
    );
  }

  renderEdges() {
    const edges = get(this.props.codebook, 'edge', {});

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
    const nodes = get(this.props.codebook, 'node', {});

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
      transitionState,
    } = this.props;

    return (
      <Screen
        show={show}
        onCancel={this.handleCancel}
        cancelLabel="Continue"
        transitionState={transitionState}
        onAcknowledgeError={this.handleCancel}
      >
        <Guided>
          <div className="editor variable-registry">
            <div className="editor__window">
              <div className="editor__content">
                <h1 className="editor__heading">Codebook</h1>
                <p>
                  Below you can find an overview of the node and edge types that you have
                  defined while creating your interview. Entities that are unused may be deleted.
                </p>
                <Guidance contentId="guidance.registry.nodes" className="editor__section">
                  <h2>Node Types</h2>
                  <div className="editor__subsection">
                    {this.renderNodes()}
                  </div>
                </Guidance>

                <Guidance contentId="guidance.registry.edges" className="editor__section">
                  <h2>Edge Types</h2>
                  <div className="editor__subsection">
                    {this.renderEdges()}
                  </div>
                </Guidance>
              </div>
            </div>
          </div>
        </Guided>
      </Screen>
    );
  }
}

Codebook.propTypes = {
  show: PropTypes.bool,
  transitionState: PropTypes.string,
  codebook: PropTypes.shape({
    node: PropTypes.object.isRequired,
    edge: PropTypes.object.isRequired,
  }).isRequired,
  onComplete: PropTypes.func,
  deleteType: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  nodeUsageIndex: PropTypes.object.isRequired,
  edgeUsageIndex: PropTypes.object.isRequired,
};

Codebook.defaultProps = {
  codebook: {
    node: {},
    edge: {},
  },
  show: true,
  transitionState: null,
  onComplete: () => {},
};

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);
  const codebook = protocol.codebook;
  const nodeIndex = getNodeIndex(state);
  const edgeIndex = getEdgeIndex(state);
  const nodeUsageIndex = utils.buildSearch([nodeIndex]);
  const edgeUsageIndex = utils.buildSearch([edgeIndex]);

  return {
    codebook,
    nodeUsageIndex,
    edgeUsageIndex,
  };
};

const mapDispatchToProps = dispatch => ({
  deleteType: bindActionCreators(codebookActions.deleteType, dispatch),
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

export { Codebook };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Codebook);
