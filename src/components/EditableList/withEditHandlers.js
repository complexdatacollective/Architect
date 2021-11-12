import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uuid from 'uuid';
import {
  compose,
  defaultProps,
  withStateHandlers,
  withHandlers,
} from 'recompose';
import { formValueSelector, change } from 'redux-form';
import { getLocus } from '@selectors/timeline';
import { actionCreators as timelineActions } from '@app/ducks/middleware/timeline';

const mapStateToProps = (state, { form, fieldName }) => {
  const items = formValueSelector(form)(state, fieldName);
  const itemCount = items ? items.length : 0;
  const locus = getLocus(state);

  return {
    itemCount,
    locus,
  };
};

const mapDispatchToProps = (dispatch, { form }) => ({
  upsert: (fieldId, value) => dispatch(change(form, fieldId, value)),
  jump: bindActionCreators(timelineActions.jump, dispatch),
});

const mapItemStateToProps = (state, {
  form, itemSelector, editField, template,
}) => {
  const item = itemSelector(state, { form, editField });
  const initialValues = item || { ...template(), id: uuid() };

  return { initialValues };
};

const stateHandlers = withStateHandlers(
  {
    editField: null,
    locus: null,
  },
  {
    setEditField: (_, { locus }) => (fieldId) => ({
      editField: fieldId,
      locus,
    }),
    clearEditField: () => () => ({
      editField: null,
      locus: null,
    }),
    resetEditField: ({ locus }, { jump }) => () => {
      jump(locus);

      return {
        editField: null,
        locus: null,
      };
    },
  },
);

const handlers = withHandlers(
  {
    handleEditField: ({ setEditField }) => setEditField,
    handleCancelEditField: ({ resetEditField }) => resetEditField,
    handleAddNew: ({ itemCount, fieldName, setEditField }) => () => {
      const newItemFieldName = `${fieldName}[${itemCount}]`;
      setEditField(newItemFieldName);
    },
    handleUpdate: ({
      editField, upsert, normalize, onChange, clearEditField,
    }) => (value) => {
      // Using onChange allows us to do some intermediate processing if necessary
      const newValue = onChange ? onChange(value) : Promise.resolve(value);

      return newValue
        .then(normalize)
        .then((fieldValue) => upsert(editField, fieldValue))
        .then(clearEditField);
    },
  },
);

const withEditHandlers = compose(
  defaultProps({
    normalize: (value) => value,
    template: () => {},
    itemSelector: (state, { form, editField }) => formValueSelector(form)(state, editField),
  }),
  connect(mapStateToProps, mapDispatchToProps),
  stateHandlers,
  handlers,
  connect(mapItemStateToProps),
);

export default withEditHandlers;
