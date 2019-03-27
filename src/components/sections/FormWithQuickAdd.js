import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, formValueSelector } from 'redux-form';
import Guidance from '../Guidance';
import { Toggle } from '../../ui/components/Fields';
import Form from './Form';
import Section from './Section';

class FormWithQuickAdd extends PureComponent {
  render() {
    const {
      quickAdd,
      disabled,
    } = this.props;

    return (
      <React.Fragment>
        <Guidance contentId="guidance.editor.quickAdd">
          <Section disabled={disabled}>
            <h2 id="issue-form">Quick Add</h2>
            <p>Should this stage use the quick add function?</p>
            <div className="stage-editor-section-form">
              <Field
                name="quickAdd"
                component={Toggle}
                label="Enable the quick add function"
              />
            </div>
          </Section>
        </Guidance>
        { !quickAdd && <Form {...this.props} /> }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, { form }) => {
  const selector = formValueSelector(form);
  const quickAdd = selector(state, 'quickAdd');
  const nodeType = selector(state, 'subject.type');

  return {
    quickAdd,
    disabled: !nodeType,
  };
};

export { FormWithQuickAdd };

export default compose(
  connect(mapStateToProps),
)(FormWithQuickAdd);
