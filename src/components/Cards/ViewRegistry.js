import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { has, get, keys } from 'lodash';
import { Node, Icon } from '../../ui/components';
import { Guided } from '../Guided';
import Guidance from '../Guidance';
import Card from './ProtocolCard';
import { getProtocol } from '../../selectors/protocol';

const renderNodes = (nodes, protocolPath = '') => {
  if (nodes.length === 0) {
    return 'No edge types defined';
  }

  return keys(nodes).map(
    (node, index) =>
      (
        <Link to={`${protocolPath}/registry/node/${node}`} key={index}>
          <Node label={node} />
        </Link>
      ),
  );
};

const renderEdges = (edges, protocolPath = '') => {
  if (edges.length === 0) {
    return 'No edge types defined';
  }

  return keys(edges).map(
    (edge, index) =>
      (
        <Link to={`${protocolPath}/registry/edge/${edge}`} key={index}>
          <Icon name="links" />
          {edge}
        </Link>
      ),
  );
};

const ViewRegistry = ({ show, variableRegistry, protocolPath, onComplete }) => {
  if (!protocolPath) { return null; }

  return (
    <Card
      show={show}
      onCancel={onComplete}
    >
      <div className="type-editor">
        <Guided className="type-editor__sections">
          <h2>View Registry</h2>

          <Guidance contentId="guidance.registry.nodes">
            <div className="type-editor__section">
              <h3>Nodes</h3>
              <div className="type-editor__subsection">
                {renderNodes(get(variableRegistry, 'node', {}), protocolPath)}
              </div>
              <div className="type-editor__subsection">
                <Link
                  to={`${protocolPath}/registry/node/`}
                  className="button button--small"
                >
                  Create new Node type
                </Link>
              </div>
            </div>
          </Guidance>

          <Guidance contentId="guidance.registry.edges">
            <div className="type-editor__section">
              <h3>Edges</h3>
              <div className="type-editor__subsection">
                {renderEdges(get(variableRegistry, 'edge', {}), protocolPath)}
              </div>
              <div className="type-editor__subsection">
                <Link
                  to={`${protocolPath}/registry/edge/`}
                  className="button button--small"
                >
                  Create new Edge type
                </Link>
              </div>
            </div>
          </Guidance>
        </Guided>
      </div>
    </Card>
  );
};

ViewRegistry.propTypes = {
  show: PropTypes.bool,
  variableRegistry: PropTypes.shape({
    node: PropTypes.object.isRequired,
    edge: PropTypes.object.isRequired,
  }).isRequired,
  protocolPath: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
};

ViewRegistry.defaultProps = {
  show: true,
  onComplete: () => {},
};

const mapStateToProps = (state, props) => {
  const protocol = getProtocol(state);

  return {
    variableRegistry: protocol.variableRegistry,
    protocolPath: has(props, 'match.params.protocol') ?
      `/edit/${get(props, 'match.params.protocol')}` : null,
  };
};

export { ViewRegistry };

export default connect(mapStateToProps)(ViewRegistry);
