/* eslint-disable */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button } from 'network-canvas-ui';
import { has, uniqueId as _uniqueId } from 'lodash';
import { arrayMove } from 'react-sortable-hoc';
import { makeGetStage } from '../selectors/stage';
import { actionCreators as stageActions } from '../ducks/modules/stages';
import Card from '../containers/Card';
import { Selectors, AddSelectorButton } from '../components';

/*
{
  operator: 'or',
  selectors: [
    { select: 'edge', options: { type, attribute, operator, value } },
  ]
}
*/

const uniqueId = () => _uniqueId(new Date().getTime());

const defaultLogic = {
  operator: 'or',
  selectors: [
    { id: 1, select: 'alter', options: { foo: 'bar', hi: 'world' } },
    { id: 2, select: 'edge', options: { baz: 'buzz' } },
  ],
};

const defaultState = {
  skipLogic: {
    selectors: [],
  },
};

class EditSkip extends PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    updateStage: PropTypes.func.isRequired,
    stageId: PropTypes.number,
    onComplete: PropTypes.func,
  };

  static defaultProps = {
    onComplete: () => {},
    stageId: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      ...defaultState,
    };
  }

  componentDidMount() {
    this.loadSkipLogicFromProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadSkipLogicFromProps(props);
  }

  onChangeOption = (event, id, option) => {
    const value = event.target.value;

    this.setState(
      (state) => {
        const selectors = state.skipLogic.selectors.map(
          (selector) => {
            if (id !== selector.id) { return selector; }

            return {
              ...selector,
              options: {
                ...selector.options,
                [option]: value,
              },
            };
          },
        );

        return {
          skipLogic: {
            ...state.skipLogic,
            selectors,
          },
        };
      },
      this.updateStage,
    );
  };

  onSave = () => {
    const stageId = this.props.stageId;

    this.props.updateStage(
      stageId,
      {
        skipLogic: this.state.skipLogic,
      },
    );

    this.props.onComplete();
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(
      state => ({
        ...state,
        skipLogic: {
          ...state.skipLogic,
          selectors: arrayMove(state.skipLogic.selectors, oldIndex, newIndex),
        },
      }),
    );
  };

  onAddSelector = (type) => {
    this.setState(
      state => ({
        ...state,
        skipLogic: {
          ...state.skipLogic,
          selectors: [...state.skipLogic.selectors, { select: type, id: uniqueId() }],
        },
      }),
    );
  };

  loadSkipLogicFromProps(props) {
    this.setState(
      state => ({
        ...state,
        skipLogic: props.skipLogic,
      }),
    );
  }

  renderSelector = selector => (
    <div className="selector">
      Select {selector.select}
    </div>
  );

  render() {
    const { skipLogic: { selectors } } = this.state;

    const buttons = [
      <Button key="save" size="small" onClick={this.onSave}>Save</Button>,
      <Button key="cancel" size="small" onClick={this.props.onCancel}>Cancel</Button>,
    ];

    return (
      <Card
        title="Edit skip logic"
        type="intent"
        buttons={buttons}
      >
        <div className="edit-skip">
          <Selectors
            selectors={selectors}
            lockAxis="y"
            useDragHandle
            onChangeOption={this.onChangeOption}
            onSortEnd={this.onSortEnd}
          />
          <AddSelectorButton onAddSelector={this.onAddSelector} />
        </div>
      </Card>
    );
  }
}

function makeMapStateToProps() {
  const getStage = makeGetStage();

  return function mapStateToProps(state, props) {
    const stage = getStage(state, props);

    return {
      skipLogic: (has(stage, 'skipLogic') ? stage.skipLogic : defaultLogic),
    };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  };
}

export { EditSkip };

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
)(EditSkip);
