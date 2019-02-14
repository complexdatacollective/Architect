import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import cx from 'classnames';
import {
  formValueSelector,
} from 'redux-form';
import PromptPreview from './PromptPreview';
import PromptFields from './PromptFields';
import Prompts from '../../../Prompts';

const SociogramPrompts = props => (
  <div className={
    cx(
      'stage-editor-section',
      { 'stage-editor-section--disabled': props.disabled },
    )}
  >
    <Prompts
      contentId="guidance.editor.sociogram_prompts"
      previewComponent={PromptPreview}
      editComponent={PromptFields}
      template={{ sortOrder: [] }}
      {...props}
    >
      <h2>Prompts</h2>
      <p>Add prompts to your Sociogram:</p>
    </Prompts>
  </div>

);

const mapStateToProps = (state, { form }) => {
  const selector = formValueSelector(form.name);
  const nodeType = selector(state, 'subject.type');

  return {
    disabled: !nodeType,
  };
};

export { SociogramPrompts };

export default compose(
  connect(mapStateToProps),
)(SociogramPrompts);
