import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../ui/components/Modal';
import EditAlterVariableRule from './EditAlterVariableRule';
import EditAlterTypeRule from './EditAlterTypeRule';
import EditEdgeRule from './EditEdgeRule';

class EditRule extends Component {
  get TypeComponent() {
    if (this.props.rule.type === 'edge') {
      return EditEdgeRule;
    }
    if (this.props.rule.type === 'alter' && !this.props.rule.options.variable) {
      return EditAlterTypeRule;
    }
    return EditAlterVariableRule;
  }

  handleClose = () => {
    this.props.onClose();
  }

  render() {
    return (
      <Modal show={!!this.props.rule}>
        <div style={{ backgroundColor: 'white', padding: '10px' }}>
          { this.props.rule && this.props.rule.options &&
            <this.TypeComponent
              rule={this.props.rule}
              variableRegistry={this.props.variableRegistry}
              onChange={this.props.onChange}
            />
          }
          <button type="button" onClick={this.handleClose}>Done</button>
        </div>
      </Modal>
    );
  }
}

EditRule.propTypes = {
  rule: PropTypes.shape({
    type: PropTypes.string,
    options: PropTypes.object,
  }).isRequired,
  variableRegistry: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export { EditRule };

export default EditRule;
