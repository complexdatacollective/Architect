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
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';

class ViewForms extends Component {
  get buttons() {
    return ([
      <Button key="cancel" color="platinum" onClick={this.handleCancel}>Back</Button>,
    ]);
  }

  handleDelete = (form) => {
    const formTitle = this.props.forms[form].title;

    this.props.openDialog({
      type: 'Warning',
      title: `Delete "${formTitle}" form`,
      message: `Are you sure you want to delete "${formTitle}"?`,
      onConfirm: () => { this.props.deleteForm(form); },
      confirmLabel: 'Delete form',
    });
  };

  handleCancel = this.props.onComplete;

  renderForm = (form, key) => (
    <Wipe key={key}>
      <div className="simple-list__item" key={key}>
        <div className="simple-list__attribute simple-list__attribute--icon">
          <Link to={`${this.props.protocolPath}/form/${key}`}>
            <Node label={get(this.props.nodes, [form.type, 'label'], '')} color={get(this.props.nodes, [form.type, 'color'], '')} />
          </Link>
        </div>
        <div className="simple-list__attribute">
          <h3>
            <Link to={`${this.props.protocolPath}/form/${key}`}>
              {form.title}
            </Link>
          </h3>
        </div>
        <div className="simple-list__attribute simple-list__attribute--options">
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
      <div className="simple-list">
        <TransitionGroup>
          {map(forms, this.renderForm)}
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
      >
        <Guided>
          <div className="editor variable-registry">
            <div className="editor__window">
              <div className="editor__content">
                <h1 className="editor__heading">Form Manager</h1>
                <p>
                  Use this screen to create, edit, and manage your forms.
                </p>
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
                        >
                          <Button>
                            Create new Form
                          </Button>
                        </Link>
                      </div>
                    }
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

ViewForms.propTypes = {
  show: PropTypes.bool,
  forms: PropTypes.object.isRequired,
  nodes: PropTypes.object.isRequired,
  protocolPath: PropTypes.string,
  onComplete: PropTypes.func,
  deleteForm: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
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
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

export { ViewForms };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewForms);
