import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';
import { get, toPairs, find } from 'lodash';
import { Button } from '../../ui/components';
import { Guided } from '../Guided';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';
import Card from './ProtocolCard';
import FilterGroup from '../FilterGroup';
import { NetworkRule, DropDown } from '../Rule';
import { getProtocol } from '../../selectors/protocol';
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

class EditSkipLogic extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    hasChanges: PropTypes.bool,
    stageId: PropTypes.string,
    onComplete: PropTypes.func,
    draft: PropTypes.any.isRequired,
    updateStage: PropTypes.func.isRequired,
    updateDraft: PropTypes.func.isRequired,
  };

  static defaultProps = {
    show: false,
    stageId: null,
    hasChanges: false,
    onComplete: () => {},
  }

  onSave = () => {
    const stageId = this.props.stageId;

    this.props.updateStage(
      stageId,
      {
        skipLogic: this.props.draft,
      },
    );

    this.props.onComplete();
  };

  renderButtons() {
    return [].concat(
      this.props.hasChanges ? [<Button key="save" size="small" onClick={this.onSave}>Continue</Button>] : [],
    );
  }

  renderEditor() {
    if (!this.props.draft) { return null; }

    const {
      updateDraft,
      draft: {
        action,
        filter,
        ...predicate
      },
    } = this.props;

    return (
      <Guided
        className="edit-skip-logic"
        defaultGuidance="foo"
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
  }

  render() {
    const {
      show,
      onComplete,
    } = this.props;

    return (
      <Card
        type="rules"
        buttons={this.renderButtons()}
        show={show}
        onCancel={onComplete}
      >
        { this.renderEditor() }
      </Card>
    );
  }
}

const mapStateToProps = (state, props) => {
  const stageId = get(props, 'match.params.id');
  const protocol = getProtocol(state);
  const stage = find(protocol.stages, ['id', stageId]);
  const logic = get(stage, 'skipLogic', defaultLogic);

  return {
    stageId,
    draft: logic,
  };
};

const mapDispatchToProps = dispatch => ({
  updateStage: bindActionCreators(stageActions.updateStage, dispatch),
});

export { EditSkipLogic };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  Draft,
)(EditSkipLogic);
