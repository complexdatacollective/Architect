import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { arrayPush, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import Guidance from '../Guidance';
import Items, { NewButton } from '../Items';

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
          <FieldArray
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

const mapDispatchToProps = (dispatch, { form, name }) => ({
  addNew: bindActionCreators(
    () => arrayPush(
      form,
      name,
      {},
    ),
    dispatch,
  ),
});

export { Variables };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Variables);
