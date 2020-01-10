import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import { Toggle } from '@codaco/ui/lib/components/Fields';
import DetachedField from '../../DetachedField';
import Form from '../Form';
import QuickAdd from '../QuickAdd';
import Section from '../Section';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withQuickAddState from './withQuickAddState';

class FormWithQuickAdd extends PureComponent {
  render() {
    const {
      quickAddEnabled,
      handleChangeQuickAdd,
      disabled,
    } = this.props;

    return (
      <React.Fragment>
        <Section disabled={disabled} contentId="guidance.editor.quickAdd">
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
        { quickAddEnabled &&
          <QuickAdd
            {...this.props}
            disabled={disabled}
          />
        }
        { !quickAddEnabled && <Form {...this.props} disabled={disabled} /> }
      </React.Fragment>
    );
  }
}

export { FormWithQuickAdd };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
  withQuickAddState,
)(FormWithQuickAdd);
