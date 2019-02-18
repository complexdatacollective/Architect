import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { map, has, get } from 'lodash';
import { TransitionGroup } from 'react-transition-group';
import { Wipe } from '../../Transitions';
import { Node, Button, Icon } from '../../../ui/components';
import { Guided } from '../../Guided';
import Guidance from '../../Guidance';
import Card from '../../Card';
import { getProtocol } from '../../../selectors/protocol';
import { makeGetUsageForType, makeGetDeleteImpact, makeGetObjectLabel } from '../../../selectors/codebook';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';
import { actionCreators as dialogsActions } from '../../../ducks/modules/dialogs';
import Type from './Type';

/**
 * This component acts as an index for types. i.e. Nodes and Edges,
 * and links to the EditType.
 */
class Codebook extends Component {
  get buttons() {
    return [
      <Button key="cancel" color="platinum" onClick={this.handleCancel}>Back</Button>,
    ];
  }

  handleDelete = (entity, type) => {
    const deletedObjects = this.props.getDeleteImpact(entity, type);
    const typeName = this.props.codebook[entity][type].name;

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

  renderNode = (node, key) => {
    const nodeColor = get(node, 'color', '');
    const usage = this.props.getUsageForType('node', key);

    return (
      <Wipe key={key}>
        <Type
          link={`${this.props.protocolPath}/codebook/node/${key}`}
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
    const edgeColor = get(edge, 'color', '');
    const usage = this.props.getUsageForType('edge', key);

    return (
      <Wipe key={key}>
        <Type
          link={`${this.props.protocolPath}/codebook/edge/${key}`}
          label={edge.label}
          handleDelete={() => this.handleDelete('edge', key)}
          usage={usage}
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
      protocolPath,
    } = this.props;

    return (
      <Card
        show={show}
        buttons={this.buttons}
        onAcknowledgeError={this.handleCancel}
      >
        <Guided>
          <div className="editor codebook">
            <div className="editor__window">
              <div className="editor__content">
                <h1 className="editor__heading">Codebook</h1>
                <p>
                  Use this screen to create, edit, and manage your node and edge types.
                </p>
                <Guidance contentId="guidance.codebook.nodes">
                  <div className="editor__section">
                    <h2>Node Types</h2>
                    <div className="editor__subsection">
                      {this.renderNodes()}
                    </div>
                    { protocolPath &&
                      <div className="editor__subsection">
                        <Link
                          to={`${protocolPath}/codebook/node/`}
                        >
                          <Button size="small" icon="add">
                            Create new Node type
                          </Button>
                        </Link>
                      </div>
                    }
                  </div>
                </Guidance>

                <Guidance contentId="guidance.codebook.edges">
                  <div className="editor__section">
                    <h2>Edge Types</h2>
                    <div className="editor__subsection">
                      {this.renderEdges()}
                    </div>
                    <div className="editor__subsection">
                      { protocolPath &&
                        <Link
                          to={`${protocolPath}/codebook/edge/`}
                        >
                          <Button size="small" icon="add">
                            Create new Edge type
                          </Button>
                        </Link>
                      }
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

Codebook.propTypes = {
  show: PropTypes.bool,
  codebook: PropTypes.shape({
    node: PropTypes.object.isRequired,
    edge: PropTypes.object.isRequired,
  }).isRequired,
  getUsageForType: PropTypes.func.isRequired,
  protocolPath: PropTypes.string,
  onComplete: PropTypes.func,
  deleteType: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  getDeleteImpact: PropTypes.func.isRequired,
  getObjectLabel: PropTypes.func.isRequired,
};

Codebook.defaultProps = {
  protocolPath: null,
  codebook: {
    node: {},
    edge: {},
  },
  show: true,
  onComplete: () => {},
};

const mapStateToProps = (state, props) => {
  const protocol = getProtocol(state);
  const codebook = protocol.codebook;
  const getUsageForType = makeGetUsageForType(state);
  const getDeleteImpact = makeGetDeleteImpact(state);
  const getObjectLabel = makeGetObjectLabel(state);

  return {
    codebook,
    getUsageForType,
    getDeleteImpact,
    getObjectLabel,
    protocolPath: has(props, 'match.params.protocol') ?
      `/edit/${get(props, 'match.params.protocol')}` : null,
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
