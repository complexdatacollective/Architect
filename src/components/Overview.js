import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import { map, get } from 'lodash';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { Node, Button } from '../ui/components';
import EdgeIcon from './EdgeIcon';
import FormCard from './StageEditor/sections/Form/FormCard';
import * as Fields from '../ui/components/Fields';
import ProtocolLink from './ProtocolLink';
import { getProtocol } from '../selectors/protocol';
import { actionCreators as protocolActions } from '../ducks/modules/protocol';

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
      <React.Fragment>
        {map(
          forms,
          (form, key) => (
            <ProtocolLink key={key} to={`form/${key}`}>
              <FormCard
                label={form.title}
                input={{
                  onChange: () => {},
                  value: ' ',
                }}
              />
            </ProtocolLink>
          ),
        )}
      </React.Fragment>
    );
  }

  render() {
    const {
      name,
      description,
      updateOptions,
      show,
      flipId,
    } = this.props;

    if (!show || !flipId) { return null; }

    return (
      <React.Fragment>
        <Flipped flipId={flipId}>
          <div className="overview">
            <div className="overview__panel">
              <div className="overview__groups">
                <div className="overview__group overview__group--title">
                  <h1 className="overview__name">{name}</h1>
                  <Fields.Text
                    className="timeline-overview__name"
                    placeholder="Enter a description for your protocol here"
                    input={{
                      value: description,
                      onChange:
                        ({ target: { value } }) => {
                          updateOptions({ description: value });
                        },
                    }}
                  />
                </div>
                <div className="overview__group">
                  <legend className="overview__group-title">Variable registry</legend>
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
                    <ProtocolLink to={'registry'}>
                      <Button size="small">Manage registry</Button>
                    </ProtocolLink>
                  </div>
                </div>
                <div className="overview__group overview__group--forms">
                  <legend className="overview__group-title">Forms</legend>
                  { this.renderForms }
                  <div className="overview__manage-button">
                    <ProtocolLink to={'forms'}>
                      <Button size="small">Manage forms</Button>
                    </ProtocolLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Flipped>
      </React.Fragment>
    );
  }
}

Overview.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  forms: PropTypes.object.isRequired,
  variableRegistry: PropTypes.object.isRequired,
  updateOptions: PropTypes.func,
  flipId: PropTypes.string,
  show: PropTypes.bool,
};

Overview.defaultProps = {
  show: true,
  name: null,
  description: null,
  flipId: null,
  updateOptions: () => {},
};

const mapDispatchToProps = dispatch => ({
  updateOptions: bindActionCreators(protocolActions.updateOptions, dispatch),
});

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);

  return {
    name: protocol && protocol.name,
    description: protocol && protocol.description,
    forms: protocol && protocol.forms,
    variableRegistry: protocol && protocol.variableRegistry,
  };
};

export { Overview };

export default compose(connect(mapStateToProps, mapDispatchToProps))(Overview);
