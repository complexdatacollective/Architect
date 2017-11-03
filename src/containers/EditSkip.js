/* eslint-disable */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { toPairs, uniqueId } from 'lodash';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import Card from './Card';
import { actionCreators as stageActions } from '../ducks/modules/stages';

/*
{
  operator: 'or',
  selectors: [
    { select: 'edge', options: { type, attribute, operator, value } },
  ]
}
*/

const DragHandle = SortableHandle(() => <span>::</span>);

const operators = {
  GREATER_THAN: 'Greater than',
  GREATER_THAN_OR_EQUAL: 'Greater than or exactly',
  LESS_THAN: 'Less than',
  LESS_THAN_OR_EQUAL: 'Less than or exactly',
  EXACTLY: 'Exactly',
  NOT: 'Not',
  EXISTS: 'Exists',
};

const nodeTypes = [
  'person',
  'place',
];

const edgeTypes = [
  'friend',
  'family',
];

const nodeAttributes = [
  'name',
  'nick',
];

const Selector = ({ select, ...otherProps }) => {
  switch (select) {
    case 'alter':
      return <AlterSelector select={select} {...otherProps} />;
    case 'edge':
      return <EdgeSelector select={select} {...otherProps} />;
    default:
      return null;
  }
}

const EdgeSelector = SortableElement((
  ({ select, options: { type }, sortIndex }) => (
    <div className="selector">
      <DragHandle /> {sortIndex} {select}
      <form>
        <label>
          Type:
          <select defaultValue={type}>
            {edgeTypes.map(
              (typeOption, index) => (
                <option key={index} value={typeOption}>{typeOption}</option>
              )
            )}
          </select>
        </label>
      </form>
    </div>
  )
));

const AlterSelector = SortableElement((
  ({ select, options: { type, operator, attribute, value }, sortIndex }) => (
    <div className="selector">
      <DragHandle /> {sortIndex} {select}
      <form>
        <label>
          Type:
          <select defaultValue={type}>
            {nodeTypes.map(
              (typeOption, index) => (
                <option key={index} value={typeOption}>{typeOption}</option>
              )
            )}
          </select>
        </label>
        <label>
          Attribute:
          <select defaultValue={attribute}>
            {nodeAttributes.map(
              (attributeOption, index) => (
                <option key={index} value={value}>{attributeOption}</option>
              )
            )}
          </select>
        </label>
        <label>
          Operator:
          <select defaultValue={operator}>
            {toPairs(operators).map(
              ([operatorOption, operatorLabel], index) => (
                <option key={index} value={operatorOption}>{operatorLabel}</option>
              )
            )}
          </select>
        </label>
        <label>
          Value:
          <input type="text" value={value} />
        </label>
      </form>
    </div>
  )
));

const Selectors = SortableContainer(
  ({ selectors }) => (
    <div className="selectors">
      {selectors.map((selector, index) => (
        <Selector key={`selector-${selector.id}`} index={index} sortIndex={index} {...selector} />
      ))}
    </div>
  ),
);

const defaultLogic = {
  operator: 'or',
  selectors: [
    { id: 1, select: 'alter', options: { foo: 'bar', hi: 'world' } },
    { id: 2, select: 'edge', options: { baz: 'buzz' } },
  ],
};

class EditSkip extends PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    updateStage: PropTypes.func.isRequired,
    stageId: PropTypes.number.isRequired,
    onComplete: PropTypes.func,
  };

  static defaultProps = {
    onComplete: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      logic: {
        ...defaultLogic,
      },
    };
  }

  onClickSave = () => {
    const stageId = this.props.stageId;

    this.props.updateStage(
      stageId,
      {
        skipLogic: this.state.logic,
      },
    );

    this.props.onComplete();
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      logic: {
        ...this.state.logic,
        selectors: arrayMove(this.state.logic.selectors, oldIndex, newIndex),
      },
    });
  };

  renderSelector = selector => (
    <div className="selector">
      Select {selector.select}
    </div>
  );

  render() {
    const { logic } = this.state;

    return (
      <Card
        title="Edit skip logic"
        type="intent"
        onCancel={this.props.onCancel}
      >
        <div className="edit-skip">
          <Selectors
            selectors={logic.selectors}
            lockAxis="y"
            useDragHandle
            onSortEnd={this.onSortEnd}
          />
        </div>
      </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  };
}

export { EditSkip };

export default compose(
  connect(null, mapDispatchToProps),
)(EditSkip);
