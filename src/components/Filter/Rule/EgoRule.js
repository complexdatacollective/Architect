import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { toPairs, includes, find, get } from 'lodash';
import { SortableElement } from 'react-sortable-hoc';
import DragHandle from './DragHandle';
import DropDown from './DropDown';
import Input from './Input';
import { getVariableOptions } from './selectors';
import { getVariableRegistry } from '../../../selectors/protocol';
import { getOperatorsForType } from './operators';

class EgoRule extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    onUpdateRule: PropTypes.func,
    onDeleteRule: PropTypes.func,
    options: PropTypes.shape({
      attribute: PropTypes.string,
      operator: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
    nodeAttributes: PropTypes.array,
    className: PropTypes.string,
    hasPersonType: PropTypes.bool,
    valueInputType: PropTypes.string,
  };

  static defaultProps = {
    options: {
      attribute: '',
      operator: '',
      value: '',
    },
    onUpdateRule: () => {},
    onDeleteRule: () => {},
    nodeAttributes: [],
    className: '',
    valueInputType: null,
    hasPersonType: false,
  };

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
      nodeAttributes,
      onUpdateRule,
      onDeleteRule,
      hasPersonType,
      options: { operator, attribute, value },
      valueInputType,
      className,
    } = this.props;

    return (
      <div className={cx('rule', 'rule--ego', className)}>
        <DragHandle />
        { hasPersonType &&
          <div className="rule__options">
            <div className="rule__option rule__option--attribute">
              <DropDown
                options={nodeAttributes}
                value={attribute}
                placeholder="{variable}"
                onChange={newValue => onUpdateRule(newValue, id, 'attribute')}
              />
            </div>
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
            {this.showValue() && (
              <div className="rule__option rule__option--value">
                <Input
                  value={value}
                  type={valueInputType}
                  onChange={newValue => onUpdateRule(newValue, id, 'value')}
                />
              </div>
            )}
          </div>
        }
        { !hasPersonType && <div>No &quot;Person&quot; node type found!</div> }
        <div className="rule__delete" onClick={() => onDeleteRule(id)} />
      </div>
    );
  }
}


// TODO: person is an implicitly required node type
function mapStateToProps(state, { options }) {
  const variableRegistry = getVariableRegistry(state);
  const personType = find(toPairs(variableRegistry.node), ([, node]) => node.name === 'person');
  const personId = personType && personType[0];
  const valueInputType = options ?
    get(variableRegistry.node, [personId, 'variables', options.attribute, 'type']) :
    undefined;

  return {
    hasPersonType: !!personType,
    nodeAttributes: getVariableOptions(variableRegistry.node)[personId],
    valueInputType,
  };
}

export { EgoRule };

export default compose(
  SortableElement,
  connect(mapStateToProps),
)(EgoRule);
