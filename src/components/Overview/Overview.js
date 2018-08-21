import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import { map, get } from 'lodash';
import { Node } from '../../ui';
import EdgeIcon from '../EdgeIcon';
import PanelGroup from './PanelGroup';
import { getProtocol } from '../../selectors/protocol';

class Overview extends Component {
  get renderNodeTypes() {
    const nodeTypes = get(this.props.variableRegistry, 'node', {});

    if (nodeTypes.length === 0) {
      return 'No node types defined';
    }

    return map(
      nodeTypes,
      (node, key) => (
        <Link to={this.pathTo(`registry/node/${key}`)} key={key}>
          <Node label={node.label} color={get(node, 'color', '')} />
        </Link>
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
        <Link
          to={this.pathTo(`registry/edge/${key}`)}
          key={key}
          title={edge.label}
        >
          <EdgeIcon color={`var(--${get(edge, 'color', '')})`} />
        </Link>
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
              <Link to={this.pathTo(`form/${key}`)}>
                {form.title}
              </Link>
            </li>
          ),
        )}
      </ul>
    );
  }

  pathTo(location) {
    const protocol = get(this.props.match, 'params.protocol');
    if (!protocol) { return ''; }
    return `/edit/${protocol}/${location}`;
  }

  render() {
    const {
      name,
      show,
      protocolFilePath,
    } = this.props;

    if (!show) { return null; }

    return (
      <Flipped flipId={protocolFilePath}>
        <div className="overview">
          <div className="overview__panel">
            <h1 className="overview__name">{name}</h1>
            <div className="overview__groups">
              <PanelGroup title="Variable registry">
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
                  <Link className="button button--small" to={this.pathTo('registry')}>
                    Manage registry
                  </Link>
                </div>
              </PanelGroup>
              <PanelGroup title="Forms">
                { this.renderForms }
                <div className="overview__manage-button">
                  <Link className="button button--small" to={this.pathTo('forms')}>
                    Manage forms
                  </Link>
                </div>
              </PanelGroup>
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
  protocolFilePath: PropTypes.string.isRequired,
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

export default connect(
  mapStateToProps,
)(Overview);
