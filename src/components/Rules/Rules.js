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
  codebook,
  draftRule,
  handleChangeJoin,
  handleChangeDraft,
  handleCancelDraft,
  handleSaveDraft,
  handleClickRule,
  handleDeleteRule,
  handleCreateAlterRule,
  handleCreateEdgeRule,
  handleCreateEgoRule,
}) => (
  <div className="rules-rules">
    <EditRule
      codebook={codebook}
      rule={draftRule}
      onChange={handleChangeDraft}
      onCancel={handleCancelDraft}
      onSave={handleSaveDraft}
    />

    <div className="rules-rules__join">
      <h3>Must match:</h3>
      <DetachedField
        component={RadioGroup}
        options={[
          { label: 'All of the following rules', value: 'AND' },
          { label: 'Any of the following rules', value: 'OR' },
        ]}
        value={join}
        onChange={handleChangeJoin}
      />
    </div>

    <div className="rules-rules__preview">
      <h3>Rules:</h3>
      <PreviewRules
        rules={rules}
        join={join}
        onClickRule={handleClickRule}
        onDeleteRule={handleDeleteRule}
        codebook={codebook}
      />
    </div>

    <div className="rules-rules__add-new">
      <Button
        type="button"
        size="small"
        color="sea-serpent"
        onClick={handleCreateAlterRule}
      >Add alter rule</Button>
      <Button
        type="button"
        size="small"
        color="paradise-pink"
        onClick={handleCreateEdgeRule}
      >Add edge rule</Button>
      { type === 'query' &&
        <Button
          type="button"
          size="small"
          color="neon-carrot"
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
  codebook: PropTypes.object.isRequired,
  draftRule: PropTypes.object,
  handleChangeJoin: PropTypes.func.isRequired,
  handleChangeDraft: PropTypes.func.isRequired,
  handleCancelDraft: PropTypes.func.isRequired,
  handleSaveDraft: PropTypes.func.isRequired,
  handleClickRule: PropTypes.func.isRequired,
  handleDeleteRule: PropTypes.func.isRequired,
  handleCreateAlterRule: PropTypes.func.isRequired,
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
