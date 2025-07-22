import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { get } from 'lodash';
import cx from 'classnames';
import Button from '@codaco/ui/lib/components/Button';
import RadioGroup from '@codaco/ui/lib/components/Fields/RadioGroup';
import DetachedField from '@components/DetachedField';
import FieldError from '@components/Form/FieldError';
import PreviewRules from './PreviewRules';
import EditRule from './EditRule';
import withDraftRule from './withDraftRule';
import withRulesChangeHandlers from './withRulesChangeHandlers';

const Rules = ({
  type,
  rules,
  join,
  error,
  meta,
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
}) => {
  const isActive = get(meta, 'active', false);
  // Default to true as may not be defined if used without redux-form
  const isTouched = get(meta, 'touched', true);
  const hasError = isTouched && !!error;

  const classes = cx(
    'rules-rules',
    {
      'rules-rules--is-active': isActive,
      'rules-rules--has-error': hasError,
    },
  );

  return (
    <div className={classes}>
      <EditRule
        codebook={codebook}
        rule={draftRule}
        onChange={handleChangeDraft}
        onCancel={handleCancelDraft}
        onSave={handleSaveDraft}
      />

      <div className="rules-rules__preview">
        <h4>Rules</h4>
        <PreviewRules
          rules={rules}
          join={join}
          onClickRule={handleClickRule}
          onDeleteRule={handleDeleteRule}
          codebook={codebook}
        />
        <FieldError show={hasError} error={error} />
      </div>

      <div className="rules-rules__add-new">
        <Button
          type="button"
          size="small"
          color="sea-serpent"
          onClick={handleCreateAlterRule}
        >
          Add alter rule
        </Button>
        <Button
          type="button"
          size="small"
          color="paradise-pink"
          onClick={handleCreateEdgeRule}
        >
          Add edge rule
        </Button>
        { type === 'query'
          && (
          <Button
            type="button"
            size="small"
            color="neon-carrot"
            onClick={handleCreateEgoRule}
          >
            Add ego rule
          </Button>
          )}
      </div>

      { rules.length > 1
        && (
        <div className="rules-rules__join">
          <h4>Must match</h4>
          <DetachedField
            name="join"
            component={RadioGroup}
            options={[
              { label: 'All rules', value: 'AND' },
              { label: 'Any rule', value: 'OR' },
            ]}
            value={join}
            onChange={handleChangeJoin}
          />
        </div>
        )}

    </div>
  );
};

Rules.propTypes = {
  type: PropTypes.oneOf(['filter', 'query']),
  // eslint-disable-next-line react/forbid-prop-types
  rules: PropTypes.array,
  join: PropTypes.string,
  error: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  meta: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  codebook: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
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
  error: null,
  meta: {},
  type: 'filter',
  draftRule: {},
};

export { Rules };

export default compose(
  withDraftRule,
  withRulesChangeHandlers,
)(Rules);
