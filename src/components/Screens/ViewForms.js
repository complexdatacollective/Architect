import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { map, get } from 'lodash';
import { TransitionGroup } from 'react-transition-group';
import { Node, Button } from '../../ui/components';
import { Wipe } from '../Transitions';
import { Guided } from '../Guided';
import Guidance from '../Guidance';
import Card from '../Card';
import Link from '../Link';
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

  renderForm = (form, id) => (
    <Wipe key={id}>
      <div className="simple-list__item">
        <div className="simple-list__attribute simple-list__attribute--icon">
          <Link
            screen="form"
            params={{ id }}
          >
            <Node label={get(this.props.nodes, [form.type, 'label'], '')} color={get(this.props.nodes, [form.type, 'color'], '')} />
          </Link>
        </div>
        <div className="simple-list__attribute">
          <h3>
            <Link
              screen="form"
              params={{ id }}
            >
              {form.title}
            </Link>
          </h3>
        </div>
        <div className="simple-list__attribute simple-list__attribute--options">
          <Button size="small" color="neon-coral" onClick={() => this.handleDelete(id)}>
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
      state,
    } = this.props;

    return (
      <Card
        show={show}
        state={state}
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
                    <div className="editor__subsection">
                      <Link
                        screen="form"
                      >
                        <Button>
                          Create new Form
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

ViewForms.propTypes = {
  show: PropTypes.bool,
  state: PropTypes.object,
  forms: PropTypes.object.isRequired,
  nodes: PropTypes.object.isRequired,
  onComplete: PropTypes.func,
  deleteForm: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
};

ViewForms.defaultProps = {
  show: true,
  state: null,
  onComplete: () => {},
};

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);

  return {
    forms: get(protocol, 'forms', {}),
    nodes: get(protocol, 'variableRegistry.node', {}),
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
