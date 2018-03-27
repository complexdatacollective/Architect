import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit as submitForm, isDirty as isFormDirty } from 'redux-form';
import { pick } from 'lodash';
import { Button } from 'network-canvas-ui';
import { ProtocolCard } from '../containers/ProtocolCard';
import StageEditor from '../components/StageEditor';

class EditStage extends PureComponent {
  static propTypes = {
    dirty: PropTypes.bool.isRequired,
    continue: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    stageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    stageId: null,
  };

  renderButtons() {
    return [].concat(
      this.props.dirty ? [<Button key="continue" size="small" onClick={this.props.continue}>Continue</Button>] : [],
    );
  }

  render() {
    const { stageId, onComplete } = this.props;

    return (
      <ProtocolCard
        buttons={this.renderButtons()}
        {...pick(this.props, ['show', 'className', 'onCancel'])}
      >
        { stageId &&
          <StageEditor
            stageId={stageId}
            onComplete={onComplete}
          />
        }
      </ProtocolCard>
    );
  }
}

const mapStateToProps = state => ({
  dirty: isFormDirty('edit-stage')(state),
});

const mapDispatchToProps = dispatch => ({
  continue: () => dispatch(submitForm('edit-stage')),
});

export { EditStage };

export default connect(mapStateToProps, mapDispatchToProps)(EditStage);
