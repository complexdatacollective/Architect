import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { FieldArray, arrayPush } from 'redux-form';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Guidance from '../../../Guidance';
import RoundButton from '../../../Form/RoundButton';
import SociogramPrompt from './SociogramPrompt';
import SortableItems from '../../SortableItems';

const fieldName = 'prompts';

const SociogramPrompts = ({
  form,
  addNewPrompt,
}) => (
  <Guidance contentId="guidance.editor.sociogram_prompts">
    <div>
      <h2>Prompts</h2>
      <p>Add prompts to your Sociogram:</p>
      <div className="stage-editor-section-name-generator-prompts">
        <div className="stage-editor-section-name-generator-prompts__prompts">
          <FieldArray
            name={fieldName}
            component={SortableItems}
            itemComponent={SociogramPrompt}
            form={form}
          />
        </div>
        <div className="stage-editor-section-name-generator-prompts__add">
          <RoundButton type="button" onClick={addNewPrompt} content="+" />
        </div>
      </div>
    </div>
  </Guidance>
);

SociogramPrompts.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  addNewPrompt: PropTypes.func.isRequired,
};

SociogramPrompts.defaultProps = {
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch, { form: { name } }) => ({
  addNewPrompt: bindActionCreators(
    () => arrayPush(
      name,
      fieldName,
      {
        id: uuid(),
        text: '',
        subject: {},
        layout: {},
        background: { concentricCircles: 4, skewedTowardCenter: false },
      },
    ),
    dispatch,
  ),
});

export { SociogramPrompts };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SociogramPrompts);
