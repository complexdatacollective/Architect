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
    logic: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
    logic: {
      ...defaultLogic,
    },
  }

  onChangeJoin = (event) => {
    const {
      logic,
      onChange,
    } = this.props;

    const value = event.target.value;

    onChange({
      ...logic,
      join: value,
    });
  };

  onUpdateRule = (event, id, option) => {
    const value = event.target.value;

    const rules = this.props.logic.rules.map(
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

    this.props.onChange({
      ...this.props.logic,
      rules,
    });
  };

  onSortRule = ({ oldIndex, newIndex }) => {
    this.props.onChange({
      ...this.props.logic,
      rules: arrayMove(this.props.logic.rules, oldIndex, newIndex),
    });
  };

  onAddRule = (type) => {
    this.props.onChange({
      ...this.props.logic,
      rules: [...this.props.logic.rules, { type, id: uniqueId() }],
    });
  };

  onDeleteRule = (id) => {
    this.props.onChange({
      ...this.props.logic,
      rules: this.props.logic.rules.filter(rule => rule.id !== id),
    });
  };

  render() {
    const { join, rules } = this.props.logic;

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
