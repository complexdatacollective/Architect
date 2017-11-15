import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { uniqueId as _uniqueId } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import { Rules, RuleAddButton, RuleDropDown } from '../components';

const uniqueId = () => _uniqueId(new Date().getTime());
const componentClassName = 'filter-group';

const defaultFilter = {
  join: '',
  rules: [],
};

const joinOptions = [
  'OR',
  'AND',
];

class FilterGroup extends PureComponent {
  static propTypes = {
    filter: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
    filter: {
      ...defaultFilter,
    },
  }

  onChangeJoin = (value) => {
    const {
      filter,
      onChange,
    } = this.props;

    onChange({
      ...filter,
      join: value,
    });
  };

  onUpdateRule = (value, id, option) => {
    const rules = this.props.filter.rules.map(
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
      ...this.props.filter,
      rules,
    });
  };

  onSortRule = ({ oldIndex, newIndex }) => {
    this.props.onChange({
      ...this.props.filter,
      rules: arrayMove(this.props.filter.rules, oldIndex, newIndex),
    });
  };

  onAddRule = (type) => {
    this.props.onChange({
      ...this.props.filter,
      rules: [...this.props.filter.rules, { type, id: uniqueId() }],
    });
  };

  onDeleteRule = (id) => {
    this.props.onChange({
      ...this.props.filter,
      rules: this.props.filter.rules.filter(rule => rule.id !== id),
    });
  };

  render() {
    const { join, rules } = this.props.filter;

    const filterGroupClasses = cx(
      componentClassName,
      {
        [`${componentClassName}--and`]: join === 'AND',
        [`${componentClassName}--or`]: join === 'OR',
      },
    );

    return (
      <div className={filterGroupClasses}>
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

export default FilterGroup;
