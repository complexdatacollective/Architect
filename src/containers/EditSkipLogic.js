import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { has, isEqual, toPairs } from 'lodash';
import { Button } from 'network-canvas-ui';
import { makeGetStage } from '../selectors/protocol';
import { actionCreators as stageActions } from '../ducks/modules/stages';
import { Card, NetworkRule, FilterGroup } from '../containers';
import { RuleDropDown } from '../components';

const defaultLogic = {
  action: 'SKIP',
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

class EditSkipLogic extends PureComponent {
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
    if (props.stageId === null) { return; } // Keep state visble in transitions

    this.setState({
      skipLogic: props.skipLogic,
    });
  }

  render() {
    const {
      show,
      cancel,
      onCancel,
    } = this.props;

    const {
      skipLogic: {
        filter,
        action,
        ...predicate
      },
    } = this.state;

    const buttons = [
      !this.hasChanges() ? <Button key="save" size="small" onClick={this.onSave}>Save</Button> : undefined,
      <Button key="cancel" size="small" onClick={onCancel}>Cancel</Button>,
    ];

    return (
      <Card
        title="Edit skip logic"
        type="intent"
        buttons={buttons}
        show={show}
        cancel={cancel}
      >
        <div className="edit-skip-logic">
          <div className="edit-skip-logic__section">
            <div className="edit-skip-logic__action">
              <RuleDropDown
                options={toPairs({ SHOW: 'Show this stage if', SKIP: 'Skip this stage if' })}
                onChange={value => this.onLogicChange({ action: value })}
                value={action}
              />
            </div>
          </div>
          <div className="edit-skip-logic__section">
            <div className="edit-skip-logic__rule">
              <NetworkRule
                logic={predicate}
                onChange={logic => this.onLogicChange(logic)}
              />
            </div>
          </div>
          <div className="edit-skip-logic__section">
            <FilterGroup
              filter={filter}
              onChange={newFilter => this.onLogicChange({ filter: newFilter })}
            />
          </div>
          <div className="edit-skip-logic__guidance">
            <div className="edit-skip-logic__bubble">
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

export { EditSkipLogic };

export default connect(makeMapStateToProps, mapDispatchToProps)(EditSkipLogic);
