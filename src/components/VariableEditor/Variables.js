import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { arrayPush } from 'redux-form';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import Guidance from '../Guidance';
import Variable from './Variable';
import { Items, NewButton } from '../StageEditor/Sortable';
import ValidatedFieldArray from '../Form/ValidatedFieldArray';

const fieldName = 'variables';

const notEmpty = value => (
  value && value.length > 0 ? undefined : 'You must create at least one prompt'
);

const Variables = ({
  form,
  addNewPrompt,
}) => (
  <Guidance contentId="guidance.editor.sociogram_prompts">
    <div className="stage-editor-section">
      <h2>Prompts</h2>
      <p>Add prompts to your Sociogram:</p>
      <div className="stage-editor-section-prompts">
        <div className="stage-editor-section-prompts__prompts">
          <ValidatedFieldArray
            name={fieldName}
            component={Items}
            itemComponent={Variable}
            form={form}
            validation={{ notEmpty }}
          />
        </div>
        <NewButton onClick={addNewPrompt} />
      </div>
    </div>
  </Guidance>
);

Variables.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  addNewPrompt: PropTypes.func.isRequired,
};

Variables.defaultProps = {
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
        layout: { allowPositioning: true },
        sortOrderBy: [],
        background: { concentricCircles: 4, skewedTowardCenter: false },
      },
    ),
    dispatch,
  ),
});

export { Variables };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Variables);
