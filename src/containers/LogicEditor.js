import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { uniqueId as _uniqueId } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import { Rules, RuleAddButton, RuleDropDown } from '../components';

const uniqueId = () => _uniqueId(new Date().getTime());

const defaultLogic = {
  operator: '',
  rules: [],
};

const operatorOptions = [
  'OR',
  'AND',
];

class LogicEditor extends PureComponent {
  static propTypes = {
    // logic: PropTypes.func.isRequired,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      ...defaultLogic,
    };
  }

  componentDidMount() {
    this.loadLogicFromProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadLogicFromProps(props);
  }

  onChange = () => {
    this.props.onChange(this.state);
  };

  onChangeOperator = (event) => {
    const value = event.target.value;

    this.setState(
      state => ({
        ...state,
        operator: value,
      }),
      this.onChange,
    );
  }

  onUpdateRule = (event, id, option) => {
    const value = event.target.value;

    this.setState(
      (state) => {
        const rules = state.rules.map(
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
          rules,
        };
      },
      this.onChange,
    );
  };

  onSortRule = ({ oldIndex, newIndex }) => {
    this.setState(
      state => ({
        rules: arrayMove(state.rules, oldIndex, newIndex),
      }),
      this.onChange,
    );
  };

  onAddRule = (type) => {
    this.setState(
      state => ({
        rules: [...state.rules, { type, id: uniqueId() }],
      }),
      this.onChange,
    );
  };

  onDeleteRule = (id) => {
    this.setState(
      state => ({
        rules: state.rules.filter(rule => rule.id !== id),
      }),
      this.onChange,
    );
  };

  // TODO: replace or update?
  loadLogicFromProps(props) {
    this.setState({
      ...props.logic,
    });
  }

  render() {
    const { operator, rules } = this.state;

    const ruleFilterClasses = cx(
      'rule-filter',
      {
        'rule-filter--and': operator === 'AND',
        'rule-filter--or': operator === 'OR',
      },
    );

    return (
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
            onUpdateRule={this.onUpdateRule}
            onDeleteRule={this.onDeleteRule}
            onSortEnd={this.onSortRule}
          />

          <div className="rule-filter__add">
            <RuleAddButton onAddRule={this.onAddRule} />
          </div>
        </div>
      </div>
    );
  }
}

export default LogicEditor;
