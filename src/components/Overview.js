import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import { map, get } from 'lodash';
import { Node } from '../ui/components';
import EdgeIcon from './EdgeIcon';
import ProtocolLink from './ProtocolLink';
import { getProtocol } from '../selectors/protocol';

class Overview extends Component {
  get renderNodeTypes() {
    const nodeTypes = get(this.props.variableRegistry, 'node', {});

    if (nodeTypes.length === 0) {
      return 'No node types defined';
    }

    return map(
      nodeTypes,
      (node, key) => (
        <ProtocolLink to={`registry/node/${key}`} key={key}>
          <Node label={node.label} color={get(node, 'color', '')} />
        </ProtocolLink>
      ),
    );
  }

  get renderEdgeTypes() {
    const edgeTypes = get(this.props.variableRegistry, 'edge', {});

    if (edgeTypes.length === 0) {
      return 'No edge types defined';
    }

    return map(
      edgeTypes,
      (edge, key) => (
        <ProtocolLink
          to={`registry/edge/${key}`}
          key={key}
          title={edge.label}
        >
          <EdgeIcon color={`var(--${get(edge, 'color', '')})`} />
        </ProtocolLink>
      ),
    );
  }

  get renderForms() {
    const forms = this.props.forms;

    if (forms.length === 0) {
      return 'No forms defined';
    }

    return (
      <ul>
        {map(
          forms,
          (form, key) => (
            <li key={key}>
              <ProtocolLink to={`form/${key}`}>
                {form.title}
              </ProtocolLink>
            </li>
          ),
        )}
      </ul>
    );
  }

  render() {
    const {
      name,
      show,
      flipId,
    } = this.props;

    if (!show) { return null; }

    return (
      <Flipped flipId={flipId}>
        <div className="overview">
          <div className="overview__panel">
            <h1 className="overview__name">{name}</h1>
            <div className="overview__groups">
              <div className="overview__group">
                <h3 className="overview__group-title">Variable registry</h3>
                <br />
                <h4>Node types</h4>
                <div>
                  { this.renderNodeTypes }
                </div>
                <br />
                <h4>Edge types</h4>
                <div>
                  { this.renderEdgeTypes }
                </div>
                <div className="overview__manage-button">
                  <ProtocolLink className="button button--small" to={'registry'}>
                    Manage registry
                  </ProtocolLink>
                </div>
              </div>
              <div className="overview__group">
                <h3 className="overview__group-title">Forms</h3>
                { this.renderForms }
                <div className="overview__manage-button">
                  <ProtocolLink className="button button--small" to={'forms'}>
                    Manage forms
                  </ProtocolLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Flipped>
    );
  }
}

Overview.propTypes = {
  name: PropTypes.string.isRequired,
  forms: PropTypes.object.isRequired,
  variableRegistry: PropTypes.object.isRequired,
  flipId: PropTypes.string.isRequired,
  show: PropTypes.bool,
};

Overview.defaultProps = {
  show: true,
};

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);

  return {
    name: protocol && protocol.name,
    forms: protocol && protocol.forms,
    variableRegistry: protocol && protocol.variableRegistry,
  };
};

export { Overview };

export default connect(mapStateToProps)(Overview);
