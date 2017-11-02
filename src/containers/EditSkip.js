import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Button } from 'network-canvas-ui';
import { actionCreators as stageActions } from '../ducks/modules/stages';

class EditSkip extends PureComponent {
  static propTypes = {
    updateStage: PropTypes.func.isRequired,
    stageId: PropTypes.string.isRequired,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    onComplete: () => {},
    onCancel: () => {},
  }

  onUpdateSkip = () => {
    const { updateStage, onComplete, stageId } = this.props;
    const options = {};
    updateStage(stageId, options);
    onComplete();
  }

  render() {
    return (
      <div className="edit-skip">
        <div className="edit-skip__title-bar">
          <h1 className="edit-skip__heading">Edit Skip</h1>
        </div>
        <div className="edit-skip__main">
          <div className="edit-skip__options">
            Foo.
          </div>
        </div>
        <div className="edit-skip__control-bar">
          <Button size="small" onClick={this.props.onCancel}>cancel</Button>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  };
}

export { EditSkip };
export default connect(null, mapDispatchToProps)(EditSkip);
