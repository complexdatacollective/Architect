import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../ui/components/Modal';
import EditAlterRule from './EditAlterRule';
import EditEdgeRule from './EditEdgeRule';
import EditEgoRule from './EditEgoRule';
import Button from '../../ui/components/Button';

class EditRule extends Component {
  get TypeComponent() {
    switch (this.props.rule.type) {
      case 'ego':
        return EditEgoRule;
      case 'edge':
        return EditEdgeRule;
      case 'alter': {
        return EditAlterRule;
      }
      default:
        return null;
    }
  }

  handleSave = () => {
    this.props.onSave();
  }

  render() {
    return (
      <Modal show={!!this.props.rule}>
        <div className="rules-edit-rule">
          { this.props.rule && this.props.rule.options &&
            <this.TypeComponent
              rule={this.props.rule}
              variableRegistry={this.props.variableRegistry}
              onChange={this.props.onChange}
            />
          }
          <div className="rules-edit-rule__controls">
            <Button type="button" onClick={this.props.onSave} color="neon-coral">Save</Button>
            <Button type="button" onClick={this.props.onCancel} color="platinum">Cancel</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

EditRule.propTypes = {
  rule: PropTypes.shape({
    type: PropTypes.string,
    options: PropTypes.object,
  }),
  variableRegistry: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

EditRule.defaultProps = {
  rule: {
    type: null,
    options: null,
  },
};

export { EditRule };

export default EditRule;
