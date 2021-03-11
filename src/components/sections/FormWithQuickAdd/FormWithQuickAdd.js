import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Toggle } from '@codaco/ui/lib/components/Fields';
import { Section } from '@components/EditorLayout';
import DetachedField from '../../DetachedField';
import Form from '../Form';
import QuickAdd from '../QuickAdd';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withQuickAddState from './withQuickAddState';

const FormWithQuickAdd = ({
  quickAddEnabled,
  handleChangeQuickAdd,
  disabled,
}) => (
  <>
    <Section disabled={disabled}>
      <h2>Quick Add</h2>
      <p>
        The quick add mode is an alternative to using a node form that allows
        a participant to add a node simply by typing a label. It may be preferable to
        using a node form if you plan to collect node attributes later in the interview.
      </p>
      <p>Should this stage use the quick add function?</p>
      <div className="stage-editor-section-form">
        <DetachedField
          component={Toggle}
          value={quickAddEnabled}
          onChange={handleChangeQuickAdd}
          label="Enable the quick add function"
        />
      </div>
    </Section>
    { quickAddEnabled
      && (
      <QuickAdd
        {...this.props}
        disabled={disabled}
      />
      )}
    { !quickAddEnabled && <Form {...this.props} disabled={disabled} /> }
  </>
);

FormWithQuickAdd.propTypes = {
  quickAddEnabled: PropTypes.bool.isRequired,
  handleChangeQuickAdd: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export { FormWithQuickAdd };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
  withQuickAddState,
)(FormWithQuickAdd);
