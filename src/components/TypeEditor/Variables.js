import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { arrayPush } from 'redux-form';
import PropTypes from 'prop-types';
import Guidance from '../Guidance';
import { Items, NewButton } from '../StageEditor/Sortable';
import ValidatedFieldArray from '../Form/ValidatedFieldArray';

const Variables = ({
  form,
  name,
  addNew,
  itemComponent: ItemComponent,
}) => (
  <Guidance contentId="guidance.editor.sociogram_prompts">
    <div className="stage-editor-section">
      <h2>Variables</h2>
      <p>Add variables:</p>
      <div className="stage-editor-section-prompts">
        <div className="stage-editor-section-prompts__prompts">
          <ValidatedFieldArray
            name={name}
            component={Items}
            itemComponent={ItemComponent}
            form={form}
          />
        </div>
        <NewButton onClick={addNew} />
      </div>
    </div>
  </Guidance>
);

Variables.propTypes = {
  form: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  itemComponent: PropTypes.node.isRequired,
  addNew: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch, { form, name, itemTemplate }) => ({
  addNew: bindActionCreators(
    () => arrayPush(
      form,
      name,
      itemTemplate,
    ),
    dispatch,
  ),
});

export { Variables };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Variables);
