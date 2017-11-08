/* eslint-disable */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button } from 'network-canvas-ui';
import { has, uniqueId as _uniqueId, isEqual } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import { makeGetStage } from '../selectors/protocol';
import { actionCreators as stageActions } from '../ducks/modules/stages';
import Card from '../containers/Card';
import { Rules, RuleAddButton, RuleDropDown } from '../components';

/*
{
  operator: 'or',
  selectors: [
    { select: 'edge', options: { type, attribute, operator, value } },
  ]
}
*/

const uniqueId = () => _uniqueId(new Date().getTime());

const defaultLogic = {
  operator: '',
  rules: [],
};

const defaultState = {
  skipLogic: { ...defaultLogic },
};

const operatorOptions = [
  'OR',
  'AND',
];

class EditSkip extends PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    updateStage: PropTypes.func.isRequired,
    stageId: PropTypes.number,
    onComplete: PropTypes.func,
  };

  static defaultProps = {
    onComplete: () => {},
    stageId: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      ...defaultState,
    };
  }

  componentDidMount() {
    this.loadSkipLogicFromProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadSkipLogicFromProps(props);
  }

  onChangeOperator = (event) => {
    const value = event.target.value;

    this.setState(
      (state) => ({
        ...this.state,
        skipLogic: {
          ...this.state.skipLogic,
          operator: value,
        }
      }),
    )
  }

  onChangeOption = (event, id, option) => {
    const value = event.target.value;

    // TODO: won't just updating props do?
    this.setState(
      (state) => {
        const rules = state.skipLogic.rules.map(
          (rule) => {
            if (id !== rule.id) { return rule; }

            return {
              ...rule,
              options: {
                ...rule.options,
                [option]: value,
              },
            };
          },
        );

        return {
          skipLogic: {
            ...state.skipLogic,
            rules,
          },
        };
      },
    );
  };

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

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(
      state => ({
        ...state,
        skipLogic: {
          ...state.skipLogic,
          rules: arrayMove(state.skipLogic.rules, oldIndex, newIndex),
        },
      }),
    );
  };

  onAddRule = (type) => {
    this.setState(
      state => ({
        ...state,
        skipLogic: {
          ...state.skipLogic,
          rules: [...state.skipLogic.rules, { type: type, id: uniqueId() }],
        },
      }),
    );
  };

  // TODO: replace or update?
  loadSkipLogicFromProps(props) {
    this.setState(
      state => ({
        ...state,
        skipLogic: props.skipLogic,
      }),
    );
  }

  hasChanges() {
    return isEqual(this.state.skipLogic, this.props.skipLogic);
  }

  render() {
    const { skipLogic: { operator, rules } } = this.state;

    const buttons = [
      !this.hasChanges() ? <Button key="save" size="small" onClick={this.onSave}>Save</Button> : undefined,
      <Button key="cancel" size="small" onClick={this.props.onCancel}>Cancel</Button>,
    ];

    const ruleFilterClasses = cx(
      'rule-filter',
      {
        'rule-filter--and': operator === 'AND',
        'rule-filter--or': operator === 'OR',
      }
    );

    return (
      <Card
        title="Edit skip logic"
        type="intent"
        buttons={buttons}
      >
        <div className="edit-skip">
          <div className={ruleFilterClasses}>
            <div className="rule-filter__operator">
              <RuleDropDown
                options={operatorOptions}
                value={operator}
                placeholder="{rule}"
                onChange={this.onChangeOperator}
              />
            </div>
            <div className="rule-filter__rules">
              <Rules
                rules={rules}
                lockAxis="y"
                useDragHandle
                onChangeOption={this.onChangeOption}
                onSortEnd={this.onSortEnd}
              />

              <div className="rule-filter__add">
                <RuleAddButton onAddRule={this.onAddRule} />
              </div>
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
