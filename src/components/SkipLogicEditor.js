import React, { Fragment } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { has, toPairs } from 'lodash';
import { Guided } from '../Guided';
import { makeGetStage } from '../../selectors/protocol';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';
import FilterGroup from '../FilterGroup';
import { NetworkRule, DropDown } from '../Rule';
import { Draft } from '../../behaviours';

const defaultLogic = {
  action: 'SKIP',
  operator: '',
  value: '',
  filter: {
    join: '',
    rules: [],
  },
};

const Guidance = (
  <Fragment>
    <p>
      Skip logic tells Network Canvas when to skip past a stage. Using it, you can create different
      pathways through your interview.
    </p>
  </Fragment>
);

const SkipLogicEditor = ({
  updateDraft,
  draft: {
    filter,
    action,
    ...predicate
  },
}) => (
  <Guided
    className="edit-skip-logic"
    defaultGuidance={Guidance}
  >
    <h1>Edit Skip Logic</h1>
    <div className="edit-skip-logic__section edit-skip-logic__section--first">
      <div className="edit-skip-logic__action">
        <DropDown
          options={toPairs({ SHOW: 'Show this stage if', SKIP: 'Skip this stage if' })}
          onChange={value => updateDraft({ action: value })}
          value={action}
        />
      </div>
    </div>
    <div className="edit-skip-logic__section">
      <div className="edit-skip-logic__rule">
        <NetworkRule
          logic={predicate}
          onChange={logic => updateDraft(logic)}
        />
      </div>
    </div>
    <div className="edit-skip-logic__section">
      <FilterGroup
        filter={filter}
        onChange={newFilter => updateDraft({ filter: newFilter })}
      />
    </div>
  </Guided>
);

SkipLogicEditor.propTypes = {
  show: PropTypes.bool,
  hasChanges: PropTypes.bool,
  stageId: PropTypes.string,
  onComplete: PropTypes.func,
  onCancel: PropTypes.func,
  draft: PropTypes.any.isRequired,
  updateStage: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
};

SkipLogicEditor.defaultProps = {
  show: false,
  draft: null,
  stageId: null,
  hasChanges: false,
  onComplete: () => {},
  onCancel: () => {},
  draft: {},
};

function getSkipLogic(stage) {
  if (!stage) { return null; }

  return (has(stage, 'skipLogic') ? stage.skipLogic : defaultLogic);
}

function makeMapStateToProps() {
  const getStage = makeGetStage();

  return function mapStateToProps(state, props) {
    const stage = getStage(state, props);
    const skipLogic = getSkipLogic(stage);

    return { draft: skipLogic };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  };
}

export { SkipLogicEditor };

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  Draft,
)(SkipLogicEditor);
