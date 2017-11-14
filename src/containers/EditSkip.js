import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { Button } from 'network-canvas-ui';
import { has, isEqual } from 'lodash';
import { makeGetStage } from '../selectors/protocol';
import { actionCreators as stageActions } from '../ducks/modules/stages';
import Card from '../containers/Card';
import LogicGroup from '../containers/LogicGroup';
import NetworkRule from '../containers/NetworkRule';

const defaultLogic = {
  operator: '',
  value: '',
  filter: {
    join: '',
    rules: [],
  },
};

const defaultState = {
  skipLogic: { ...defaultLogic },
};

class EditSkip extends PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    updateStage: PropTypes.func.isRequired,
    stageId: PropTypes.number,
    onComplete: PropTypes.func,
    skipLogic: PropTypes.object.isRequired,
    show: PropTypes.bool,
    cancel: PropTypes.bool,
  };

  static defaultProps = {
    onComplete: () => {},
    stageId: null,
    show: false,
    cancel: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      ...defaultState,
    };
  }

  componentDidMount() {
    this.loadLogicFromProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadLogicFromProps(props);
  }

  onSave = () => {
    const stageId = this.props.stageId;

    this.props.updateStage(
      stageId,
      {
        skipLogic: this.state.skipLogic,
      },
    );

    this.props.onComplete();
  };

  onLogicChange = (logic) => {
    this.setState(
      state => ({
        skipLogic: {
          ...state.skipLogic,
          ...logic,
        },
      }),
    );
  };

  hasChanges() {
    return isEqual(this.state.skipLogic, this.props.skipLogic);
  }

  loadLogicFromProps(props) {
    this.setState({
      skipLogic: props.skipLogic,
    });
  }

  render() {
    const {
      show,
      cancel,
    } = this.props;

    const {
      skipLogic: {
        filter,
        ...predicate
      },
    } = this.state;

    console.log('render', filter);

    const buttons = [
      !this.hasChanges() ? <Button key="save" size="small" onClick={this.onSave}>Save</Button> : undefined,
      <Button key="cancel" size="small" onClick={this.props.onCancel}>Cancel</Button>,
    ];

    return (
      <Card
        title="Edit skip logic"
        type="intent"
        buttons={buttons}
        show={show}
        cancel={cancel}
      >
        <div className="edit-skip">
          <div className="edit-skip__section">
            [Skip] this stage if:
          </div>
          <div className="edit-skip__section">
            {this.props.stageId &&
              <NetworkRule
                key={`network-rule_${this.props.stageId}`}
                logic={predicate}
                onChange={logic => this.onLogicChange(logic)}
              />
            }
          </div>
          <div className="edit-skip__section">
            {this.props.stageId &&
              <LogicGroup
                key={`logic-group_${this.props.stageId}`}
                logic={filter}
                onChange={logic => this.onLogicChange({ filter: logic })}
              />
            }
          </div>
          <div className="edit-skip__guidance">
            <div className="edit-skip__bubble">
              Skip logic tells Network Canvas when to skip past a stage. Using it,
              you can create different pathways through your interview.
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

function makeMapStateToProps() {
  const getStage = makeGetStage();

  return function mapStateToProps(state, props) {
    const stage = getStage(state, props);

    return {
      skipLogic: (has(stage, 'skipLogic') ? stage.skipLogic : defaultLogic),
    };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  };
}

export { EditSkip };

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
)(EditSkip);
