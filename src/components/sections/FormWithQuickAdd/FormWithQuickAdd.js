import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import Guidance from '../../Guidance';
import DetachedField from '../../DetachedField';
import { Toggle } from '../../../ui/components/Fields';
import Form from '../Form';
import QuickAdd from '../QuickAdd';
import Section from '../Section';
import withSubject from '../../enhancers/withSubject';
import withQuickAddState from './withQuickAddState';

class FormWithQuickAdd extends PureComponent {
  render() {
    const {
      quickAddEnabled,
      handleChangeQuickAdd,
      entity,
    } = this.props;

    const disabled = !entity;

    return (
      <React.Fragment>
        <Guidance contentId="guidance.editor.quickAdd">
          <Section disabled={disabled} compactNext>
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
        </Guidance>
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
  withQuickAddState,
)(FormWithQuickAdd);
