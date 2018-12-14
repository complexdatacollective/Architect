import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import PreviewRules from './PreviewRules';
import EditRule from './EditRule';
import Button from '../../ui/components/Button';
import RadioGroup from '../../ui/components/Fields/RadioGroup';
import DetachedField from '../DetachedField';
import withDraftRule from './withDraftRule';
import withRulesChangeHandlers from './withRulesChangeHandlers';

const Rules = ({
  type,
  rules,
  join,
  variableRegistry,
  draftRule,
  handleChangeJoin,
  handleChangeDraft,
  handleCancelDraft,
  handleSaveDraft,
  handleClickRule,
  handleDeleteRule,
  handleCreateAlterTypeRule,
  handleCreateAlterVariableRule,
  handleCreateEdgeRule,
  handleCreateEgoRule,
}) => (
  <div className="rules-rules">
    <div className="rules-rules__join">
      Must match:
      <DetachedField
        component={RadioGroup}
        options={[
          { label: 'All', value: 'AND' },
          { label: 'Any', value: 'OR' },
        ]}
        value={join}
        onChange={handleChangeJoin}
      />
    </div>

    <EditRule
      variableRegistry={variableRegistry}
      rule={draftRule}
      onChange={handleChangeDraft}
      onCancel={handleCancelDraft}
      onSave={handleSaveDraft}
    />

    <div className="rules-rules__preview">
      <PreviewRules
        rules={rules}
        join={join}
        onClickRule={handleClickRule}
        onDeleteRule={handleDeleteRule}
        variableRegistry={variableRegistry}
      />
    </div>

    <div className="rules-rules__add-new">
      <Button
        type="button"
        size="small"
        onClick={handleCreateAlterTypeRule}
      >Add alter type rule</Button>
      <Button
        type="button"
        size="small"
        onClick={handleCreateAlterVariableRule}
      >Add alter variable rule</Button>
      <Button
        type="button"
        size="small"
        onClick={handleCreateEdgeRule}
      >Add edge rule</Button>
      { type === 'query' &&
        <Button
          type="button"
          size="small"
          onClick={handleCreateEgoRule}
        >Add ego rule</Button>
      }
    </div>
  </div>
);

Rules.propTypes = {
  type: PropTypes.oneOf(['filter', 'query']),
  rules: PropTypes.array,
  join: PropTypes.string,
  variableRegistry: PropTypes.object.isRequired,
  draftRule: PropTypes.object,
  handleChangeJoin: PropTypes.func.isRequired,
  handleChangeDraft: PropTypes.func.isRequired,
  handleCancelDraft: PropTypes.func.isRequired,
  handleSaveDraft: PropTypes.func.isRequired,
  handleClickRule: PropTypes.func.isRequired,
  handleDeleteRule: PropTypes.func.isRequired,
  handleCreateAlterTypeRule: PropTypes.func.isRequired,
  handleCreateAlterVariableRule: PropTypes.func.isRequired,
  handleCreateEdgeRule: PropTypes.func.isRequired,
  handleCreateEgoRule: PropTypes.func.isRequired,
};

Rules.defaultProps = {
  rules: [],
  join: null,
  type: 'filter',
  draftRule: {},
};

export { Rules };

export default compose(
  withDraftRule,
  withRulesChangeHandlers,
)(Rules);
