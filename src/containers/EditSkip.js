import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import Card from './Card';
import { actionCreators as stageActions } from '../ducks/modules/stages';

class EditSkip extends PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    updateStage: PropTypes.func.isRequired,
    index: PropTypes.number,
    onComplete: PropTypes.func,
  };

  static defaultProps = {
    onComplete: () => {},
    id: null,
    index: null,
  }

  onClickStageType = (type) => {
    const index = this.props.index;

    this.props.updateStage({ type }, index);

    this.props.onComplete();
  }

  render() {
    return (
      <Card
        title="Edit skip logic"
        type="intent"
        onCancel={this.props.onCancel}
      >
        <div className="edit-skip">
          Test
        </div>
      </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  };
}

export { EditSkip };

export default compose(
  connect(null, mapDispatchToProps),
)(EditSkip);
