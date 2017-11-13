import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { uniqueId as _uniqueId } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import { Rules, RuleAddButton, RuleDropDown } from '../components';

const uniqueId = () => _uniqueId(new Date().getTime());
const componentClassName = 'logic-group';

const defaultLogic = {
  join: '',
  rules: [],
};

const joinOptions = [
  'OR',
  'AND',
];

class LogicGroup extends PureComponent {
  static propTypes = {
    logic: PropTypes.object.isRequired,
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
    this.loadLogicFromProps();
  }

  onChange = () => {
    this.props.onChange(this.state);
  };

  onChangeJoin = (event) => {
    const value = event.target.value;

    this.setState(
      state => ({
        ...state,
        join: value,
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

  loadLogicFromProps() {
    this.setState({
      ...this.props.logic,
    });
  }

  render() {
    const { join, rules } = this.state;

    const LogicGroupClasses = cx(
      componentClassName,
      {
        [`${componentClassName}--and`]: join === 'AND',
        [`${componentClassName}--or`]: join === 'OR',
      },
    );

    return (
      <div className={LogicGroupClasses}>
        <div className={`${componentClassName}__join`}>
          <RuleDropDown
            options={joinOptions}
            value={join}
            placeholder="{join}"
            onChange={this.onChangeJoin}
          />
        </div>
        <div className={`${componentClassName}__rules`}>
          <Rules
            rules={rules}
            lockAxis="y"
            useDragHandle
            onUpdateRule={this.onUpdateRule}
            onDeleteRule={this.onDeleteRule}
            onSortEnd={this.onSortRule}
          />

          <div className={`${componentClassName}__add`}>
            <RuleAddButton onAddRule={this.onAddRule} />
          </div>
        </div>
      </div>
    );
  }
}

export default LogicGroup;
