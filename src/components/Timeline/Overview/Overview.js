import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { map, get, keys } from 'lodash';
import { compose } from 'recompose';
import { SeamlessText } from '../../Form/Fields';
import { Tweened } from '../../../behaviours/Tweened';
import { Node, Icon } from '../../../ui';
import { actionCreators as protocolActions } from '../../../ducks/modules/protocol';
import PanelGroup from './PanelGroup';

// eslint-disable-next-line
const renderForm = ({ protocolPath, form }) => (
  <li key={form}>
    <Link to={`${protocolPath}/forms`}>
      {form}
    </Link>
  </li>
);

class Overview extends Component {
  get protocolPath() {
    const protocol = get(this.props.match, 'params.protocol', '');
    return `/edit/${protocol}`;
  }

  get renderNodeTypes() {
    const nodeTypes = get(this.props.variableRegistry, 'node', {});

    if (nodeTypes.length === 0) {
      return 'No node types defined';
    }

    return map(
      nodeTypes,
      (node, key) => (
        <Link to={`${this.protocolPath}/registry/`} key={key}>
          <Node label={key} color={get(node, 'color', '')} />
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
      (edge, index) => (
        <Link to={`${this.protocolPath}/registry/`} key={index}>
          <Icon name="links" label={edge} color={get(edge, 'color', '')} />
        </Link>
      ),
    );
  }

  get renderForms() {
    const forms = keys(this.props.forms);

    if (forms.length === 0) {
      return 'No forms defined';
    }

    return (
      <ul>
        {map(forms, form => renderForm({ form, protocolPath: this.protocolPath }))}
      </ul>
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
                  { this.renderForms }
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
  match: PropTypes.object.isRequired,
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
