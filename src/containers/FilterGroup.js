import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { uniqueId as _uniqueId } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import { Rules, RuleAddButton, RuleDropDown } from '../components';

const uniqueId = () => _uniqueId(new Date().getTime());

const defaultFilter = {
  join: '',
  rules: [],
};

const joinOptions = [
  'OR',
  'AND',
];

const filterGroupClasses = join =>
  cx(
    'filter-group',
    {
      'filter-group--and': join === 'AND',
      'filter-group--or': join === 'OR',
    },
  );

const updateRuleOption = (rule, option, value) => ({
  ...rule,
  options: {
    ...rule.options,
    [option]: value,
  },
});

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
    const { filter, onChange } = this.props;

    const rules = filter.rules.map(
      rule => (id !== rule.id ? rule : updateRuleOption(rule, option, value)),
    );

    onChange({
      ...filter,
      rules,
    });
  };

  onMoveRule = ({ oldIndex, newIndex }) => {
    const { filter, onChange } = this.props;

    onChange({
      ...filter,
      rules: arrayMove(filter.rules, oldIndex, newIndex),
    });
  };

  onAddRule = (type) => {
    const { filter, onChange } = this.props;

    onChange({
      ...filter,
      rules: [...filter.rules, { type, id: uniqueId() }],
    });
  };

  onDeleteRule = (id) => {
    const { filter, onChange } = this.props;

    onChange({
      ...filter,
      rules: filter.rules.filter(rule => rule.id !== id),
    });
  };

  render() {
    const { join, rules } = this.props.filter;

    return (
      <div className={filterGroupClasses(join)}>
        <div className="filter-group__join">
          <RuleDropDown
            options={joinOptions}
            value={join}
            placeholder="{join}"
            onChange={this.onChangeJoin}
          />
        </div>
        <div className="filter-group__rules">
          <Rules
            rules={rules}
            lockAxis="y"
            useDragHandle
            onUpdateRule={this.onUpdateRule}
            onDeleteRule={this.onDeleteRule}
            onSortEnd={this.onMoveRule}
          />

          <div className="filter-group__add">
            <RuleAddButton onAddRule={this.onAddRule} />
          </div>
        </div>
      </div>
    );
  }
}

export default FilterGroup;
