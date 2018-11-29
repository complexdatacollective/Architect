import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import uuid from 'uuid';
import { arrayMove } from 'react-sortable-hoc';
import { parse } from './convert';
import { AddButton, DropDown } from './Rule';
import Rules from './Rules';
import { getVariableTypes } from './Rule/selectors';

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

const mergeRuleOption = (rule, option, value) => ({
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
    variableRegistry: PropTypes.object.isRequired,
    variableTypes: PropTypes.object.isRequired,
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
      rule => (id !== rule.id ? rule : mergeRuleOption(rule, option, value)),
    );

    const newFilter = parse(
      {
        ...filter,
        rules,
      },
      { types: this.props.variableTypes },
    );

    onChange(newFilter);
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
      rules: [...filter.rules, { type, id: uuid() }],
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
    const { filter: { join, rules }, variableRegistry } = this.props;

    return (
      <div className={filterGroupClasses(join)}>
        <div className="filter-group__join">
          <DropDown
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
            variableRegistry={variableRegistry}
          />

          <div className="filter-group__add">
            <AddButton onAddRule={this.onAddRule} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  variableTypes: getVariableTypes(state, ownProps),
});

export { FilterGroup };

export default compose(
  connect(mapStateToProps),
)(FilterGroup);
