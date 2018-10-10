import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { toPairs, has, includes, keys, flow, map, fromPairs } from 'lodash';
import { SortableElement } from 'react-sortable-hoc';
import DragHandle from './DragHandle';
import DropDown from './DropDown';
import Input from './Input';
import { getVariableRegistry } from '../../../selectors/protocol';

const operators = toPairs({
  EXACTLY: 'is Exactly',
  EXISTS: 'Exists',
  NOT_EXISTS: 'Not Exists',
  NOT: 'is Not',
  GREATER_THAN: 'is Greater Than',
  GREATER_THAN_OR_EQUAL: 'is Greater Than or Exactly',
  LESS_THAN: 'is Less Than',
  LESS_THAN_OR_EQUAL: 'is Less Than or Exactly',
});

class EdgeRule extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    onUpdateRule: PropTypes.func,
    onDeleteRule: PropTypes.func,
    options: PropTypes.shape({
      type: PropTypes.string,
      operator: PropTypes.string,
      attribute: PropTypes.string,
      value: PropTypes.string,
    }),
    edgeTypes: PropTypes.array,
    edgeAttributes: PropTypes.object,
    className: PropTypes.string,
  };

  static defaultProps = {
    options: {
      type: '',
      operator: '',
      attribute: '',
      value: '',
    },
    edgeTypes: [],
    edgeAttributes: {},
    onUpdateRule: () => {},
    onDeleteRule: () => {},
    className: '',
  };

  showAttributes() {
    return has(this.props.edgeAttributes, this.props.options.type);
  }

  showOperator() {
    return !!this.props.options.attribute;
  }

  showValue() {
    return !!this.props.options.operator &&
      !includes(['EXISTS', 'NOT_EXISTS'], this.props.options.operator);
  }

  render() {
    const {
      id,
      edgeTypes,
      edgeAttributes,
      onUpdateRule,
      onDeleteRule,
      options: { type, operator, attribute, value },
      className,
    } = this.props;

    return (
      <div className={cx('rule', 'rule--edge', className)}>
        <DragHandle />
        <div className="rule__options">
          <div className="rule__option rule__option--type">
            <DropDown
              options={edgeTypes}
              value={type}
              placeholder="{type}"
              onChange={newValue => onUpdateRule(newValue, id, 'type')}
            />
          </div>
          {this.showAttributes() && (
            <div className="rule__option rule__option--attribute">
              <DropDown
                options={has(edgeAttributes, type) ? edgeAttributes[type] : []}
                value={attribute}
                placeholder="{variable}"
                onChange={newValue => onUpdateRule(newValue, id, 'attribute')}
              />
            </div>
          )}
          { this.showOperator() && (
            <div className="rule__option rule__option--operator">
              <DropDown
                options={operators}
                value={operator}
                placeholder="{rule}"
                onChange={newValue => onUpdateRule(newValue, id, 'operator')}
              />
            </div>
          )}
          { this.showValue() && (
            <div className="rule__option rule__option--value">
              <Input
                value={value}
                onChange={newValue => onUpdateRule(newValue, id, 'value')}
              />
            </div>
          )}
        </div>
        <div className="rule__delete" onClick={() => onDeleteRule(id)} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const variableRegistry = getVariableRegistry(state);

  const edgeAttributes = flow(
    toPairs,
    edgeTypes => map(
      edgeTypes,
      ([edgeType, options]) => [edgeType, keys(options.variables)],
    ),
    fromPairs,
  );

  return {
    edgeTypes: keys(variableRegistry.edge),
    edgeAttributes: edgeAttributes(variableRegistry.edge),
  };
}

export { EdgeRule };

export default compose(
  SortableElement,
  connect(mapStateToProps),
)(EdgeRule);

