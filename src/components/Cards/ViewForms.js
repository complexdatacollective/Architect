import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { map, has, get } from 'lodash';
import { TransitionGroup } from 'react-transition-group';
import { Node, Button } from '../../ui/components';
import { Wipe } from '../Transitions';
import { Guided } from '../Guided';
import Guidance from '../Guidance';
import Card from '../Card';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as formActions } from '../../ducks/modules/protocol/forms';

class ViewForms extends Component {
  handleDelete = (form) => {
    // eslint-disable-next-line no-alert
    if (confirm(`Are you sure you want to delete "${form}"?`)) {
      this.props.deleteForm(form);
    }
  };

  renderForm = (form, key) => (
    <Wipe key={key}>
      <div className="list__item" key={key}>
        <div className="list__attribute list__attribute--icon">
          <Link to={`${this.props.protocolPath}/form/${key}`}>
            <Node label={form.type} color={get(this.props.nodes, [form.type, 'color'], '')} />
          </Link>
        </div>
        <div className="list__attribute">
          <h3>
            <Link to={`${this.props.protocolPath}/form/${key}`}>
              {form.title}
            </Link>
          </h3>
        </div>
        <div className="list__attribute list__attribute--options">
          <Button size="small" color="neon-coral" onClick={() => this.handleDelete(key)}>
            Delete
          </Button>
        </div>
      </div>
    </Wipe>
  );

  renderForms() {
    const forms = this.props.forms;

    if (forms.length === 0) {
      return 'No forms defined';
    }

    return (
      <div className="list">
        <TransitionGroup>
          {map(forms, this.renderForm)}
        </TransitionGroup>
      </div>
    );
  }

  renderButtons() {
    return ([
      <Button key="cancel" size="small" color="platinum" onClick={this.props.onComplete}>Back</Button>,
    ]);
  }

  render() {
    const {
      show,
      protocolPath,
    } = this.props;

    return (
      <Card
        show={show}
        buttons={this.renderButtons()}
      >
        <div className="editor variable-registry">
          <Guided className="editor__sections">
            <h1>Form Manager</h1>

            <Guidance contentId="guidance.forms.index">
              <div className="editor__section">
                <h2>Existing Forms</h2>
                <div className="editor__subsection">
                  {this.renderForms()}
                </div>
                { protocolPath &&
                  <div className="editor__subsection">
                    <Link
                      to={`${protocolPath}/form/`}
                      className="button button--small"
                    >
                      Create new Form
                    </Link>
                  </div>
                }
              </div>
            </Guidance>
          </Guided>
        </div>
      </Card>
    );
  }
}

ViewForms.propTypes = {
  show: PropTypes.bool,
  forms: PropTypes.object.isRequired,
  nodes: PropTypes.object.isRequired,
  protocolPath: PropTypes.string,
  onComplete: PropTypes.func,
  deleteForm: PropTypes.func.isRequired,
};

ViewForms.defaultProps = {
  protocolPath: null,
  show: true,
  onComplete: () => {},
};

const mapStateToProps = (state, props) => {
  const protocol = getProtocol(state);

  return {
    forms: get(protocol, 'forms', {}),
    nodes: get(protocol, 'variableRegistry.node', {}),
    protocolPath: has(props, 'match.params.protocol') ?
      `/edit/${get(props, 'match.params.protocol')}` : null,
  };
};

const mapDispatchToProps = dispatch => ({
  deleteForm: bindActionCreators(formActions.deleteForm, dispatch),
});

export { ViewForms };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewForms);
