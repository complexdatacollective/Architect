import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import DetachedField from '../../DetachedField';
import { Toggle } from '../../../ui/components/Fields';
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
        <Section disabled={disabled} compactNext contentId="guidance.editor.quickAdd">
          <h2>Quick Add</h2>
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
