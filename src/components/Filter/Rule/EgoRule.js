import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { toPairs, includes, find } from 'lodash';
import { SortableElement } from 'react-sortable-hoc';
import DragHandle from './DragHandle';
import DropDown from './DropDown';
import Input from './Input';
import { getVariableOptions } from './selectors';
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
                  options={operators}
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
function mapStateToProps(state) {
  const variableRegistry = getVariableRegistry(state);
  const personType = find(toPairs(variableRegistry.node), ([, node]) => node.name === 'person');
  const personId = personType && personType[0];

  return {
    hasPersonType: !!personType,
    nodeAttributes: getVariableOptions(variableRegistry.node)[personId],
  };
}

export { EgoRule };

export default compose(
  SortableElement,
  connect(mapStateToProps),
)(EgoRule);
