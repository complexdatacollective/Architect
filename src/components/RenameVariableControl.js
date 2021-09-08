import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, submit } from 'redux-form';
import { compose } from 'redux';
import { get } from 'lodash';
import { Button } from '@codaco/ui';
import TextField from '@codaco/ui/lib/components/Fields/Text';
import { getType } from '@selectors/codebook';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';
import ContextualDialog, { Controls } from '@components/ContextualDialog';

const BasicForm = compose(
  reduxForm(),
  connect(null, { submit }),
)(({ form, children, submit: submitForm }) => {
  // Custom submit handler to prevent propagation to any parent redux-form forms.
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    submitForm(form);
  }, [form]);

  return (
    <form onSubmit={onSubmit}>
      {children}
    </form>
  );
});

const RenameVariableControl = ({
  id,
  name,
  children,
  entity,
  type,
  updateVariable,
}) => {
  const formName = `rename-variable-${id}`;
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSubmit = useCallback((values) => {
    const { name: newName } = values;
    updateVariable(entity, type, id, { name: newName }, true);
    setIsOpen(false);
  }, [id]);

  const controls = [
    <Button
      key="close"
      onClick={handleClose}
      color="white"
    >
      Close
    </Button>,
    <Button
      key="save"
      type="submit"
    >
      Save
    </Button>,
  ];

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const initialValues = useMemo(() => ({
    name,
  }), [name]);

  return (
    <>
      {children({ onClick: handleOpen })}
      { isOpen && (
        <ContextualDialog
          className="rename-variable__dialog"
          windowRoot={document.body}
          controls={controls}
        >
          <BasicForm
            form={formName}
            onSubmit={handleSubmit}
            initialValues={initialValues}
          >
            <h3>Rename Variable</h3>
            <Field component={TextField} name="name" />

            <Controls>
              {controls}
            </Controls>
          </BasicForm>
        </ContextualDialog>
      )}
    </>
  );
};

RenameVariableControl.propTypes = {
  id: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  updateVariable: PropTypes.func.isRequired,
  name: PropTypes.string,
  children: PropTypes.func.isRequired,
};

RenameVariableControl.defaultProps = {
  name: null,
};

const mapStateToProps = (state, { entity, type, id }) => {
  const entityDefinition = getType(state, { entity, type });
  const name = get(entityDefinition, ['variables', id, 'name'], '');
  return { name };
};

const mapDispatchToProps = {
  updateVariable: codebookActions.updateVariable,
};

const withState = connect(mapStateToProps, mapDispatchToProps);

export default withState(RenameVariableControl);
