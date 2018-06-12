import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { FieldArray, arrayPush } from 'redux-form';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import RoundButton from '../../../Form/RoundButton';
import SociogramPrompt from './SociogramPrompt';
import SortableItems from '../../SortableItems';

const fieldName = 'prompts';

const SociogramPrompts = ({
  form,
  prompts,
  addNewPrompt,
}) => (
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
);

SociogramPrompts.Guidance = (
  <Fragment>
    <p>
      Prompts allow you to specify one or more specific questions to post to the participant,
      in order to encourage the recall of nodes.
    </p>
    <p>
      Prompts should be carefully considered, and grounded in existing literature wherever
      possible. Think carefully about if you want to use one name generator with muiltiple
      prompts, or many name generators with a single prompt. Your choice depends on your specific
      research goals, and the needs of your research population.
    </p>
  </Fragment>
);

SociogramPrompts.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  prompts: PropTypes.array.isRequired,
  addNewPrompt: PropTypes.func.isRequired,
};

SociogramPrompts.defaultProps = {
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch, { form: { name } }) => ({
  addNewPrompt: bindActionCreators(
    () => arrayPush(name, fieldName, { id: uuid() }),
    dispatch,
  ),
});

export { SociogramPrompts };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(SociogramPrompts);
