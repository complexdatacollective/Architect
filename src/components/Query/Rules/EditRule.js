import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Modal from '@codaco/ui/lib/components/Modal';
import Button from '@codaco/ui/lib/components/Button';
import EditAlterRule from './EditAlterRule';
import EditEdgeRule from './EditEdgeRule';
import EditEgoRule from './EditEgoRule';

class EditRule extends Component {
  get TypeComponent() {
    // eslint-disable-next-line react/destructuring-assignment
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
    const { onSave } = this.props;
    onSave();
  }

  render() {
    const {
      rule, codebook, onChange, onCancel, onSave,
    } = this.props;
    return (
      <Modal show={!!rule}>
        <motion.div layout className="rules-edit-rule">
          <div className="rules-edit-rule__container">
            { rule && rule.options
              && (
              <this.TypeComponent
                rule={rule}
                codebook={codebook}
                onChange={onChange}
              />
              )}
            <div className="rules-edit-rule__controls">
              <Button type="button" onClick={onCancel} color="platinum">Cancel</Button>
              <Button type="button" onClick={onSave} color="primary">Finish and Close</Button>
            </div>
          </div>
        </motion.div>
      </Modal>
    );
  }
}

EditRule.propTypes = {
  rule: PropTypes.shape({
    type: PropTypes.string,
    options: PropTypes.object,
  }),
  codebook: PropTypes.object.isRequired,
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
