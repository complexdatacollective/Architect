import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import cx from 'classnames';
import { Field, formValueSelector } from 'redux-form';
import Guidance from '../../../Guidance';
import { Toggle } from '../../../../ui/components/Fields';
import Form from '../Form';

class FormWithQuickAdd extends PureComponent {
  render() {
    const {
      quickAdd,
      disabled,
    } = this.props;

    const formClasses = cx(
      'stage-editor-section',
      { 'stage-editor-section--disabled': disabled },
    );

    return (
      <div>
        <Guidance contentId="guidance.editor.quickAdd">
          <div className={formClasses}>
            <h2 id="issue-form">Quick Add</h2>
            <p>Should this stage use the quick add function?</p>
            <div className="stage-editor-section-form">
              <Field
                name="quickAdd"
                component={Toggle}
                label="Enable the quick add function"
              />
            </div>
          </div>
        </Guidance>
        { !quickAdd && <Form {...this.props} /> }
      </div>
    );
  }
}

const mapStateToProps = (state, { form }) => {
  const selector = formValueSelector(form.name);
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
