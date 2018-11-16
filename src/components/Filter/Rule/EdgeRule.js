import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { has, includes, map, get } from 'lodash';
import { SortableElement } from 'react-sortable-hoc';
import DragHandle from './DragHandle';
import DropDown from './DropDown';
import Input from './Input';
import { getVariableRegistry } from '../../../selectors/protocol';
import { getVariableOptions } from './selectors';
import { getOperatorsForType } from './operators';

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
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
    edgeTypes: PropTypes.array,
    edgeAttributes: PropTypes.object,
    valueInputType: PropTypes.string,
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
    valueInputType: null,
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
      valueInputType,
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
                options={getOperatorsForType(valueInputType)}
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
                type={valueInputType}
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

function mapStateToProps(state, { options }) {
  const variableRegistry = getVariableRegistry(state);
  const edgeTypes = map(variableRegistry.edge, (edge, edgeId) => [edgeId, edge.name]);
  const valueInputType = options ?
    get(variableRegistry.node, [options.type, 'variables', options.attribute, 'type']) :
    undefined;

  return {
    edgeTypes,
    edgeAttributes: getVariableOptions(variableRegistry.edge),
    valueInputType,
  };
}

export { EdgeRule };

export default compose(
  SortableElement,
  connect(mapStateToProps),
)(EdgeRule);

