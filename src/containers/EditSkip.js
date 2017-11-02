import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import Card from './Card';
import { actionCreators as stageActions } from '../ducks/modules/stages';

/*
{
  operator: 'or',
  selectors: [
    { select: 'edge', options: {} },
  ]
}
*/

const defaultLogic = {
  operator: 'or',
  selectors: [
    { select: 'edge', options: {} },
  ],
};

class EditSkip extends PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    updateStage: PropTypes.func.isRequired,
    stageId: PropTypes.number.isRequired,
    onComplete: PropTypes.func,
  };

  static defaultProps = {
    onComplete: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      logic: {
        ...defaultLogic,
      },
    };
  }

  onClickSave = () => {
    const stageId = this.props.stageId;

    this.props.updateStage(
      stageId,
      {
        skipLogic: this.state.logic,
      },
    );

    this.props.onComplete();
  }

  renderSelector = selector => (
    <div className="selector">
      Select {selector.select}
    </div>
  );

  render() {
    const { logic } = this.state;

    return (
      <Card
        title="Edit skip logic"
        type="intent"
        onCancel={this.props.onCancel}
      >
        <div className="edit-skip">
          { logic.selectors.map(this.renderSelector) }
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
