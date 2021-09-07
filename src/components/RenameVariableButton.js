import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { get } from 'lodash';
import { Button } from '@codaco/ui';
import TextField from '@codaco/ui/lib/components/Fields/Text';
import { getType } from '@selectors/codebook';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';
import ContextualDialog, { Controls } from '@components/ContextualDialog';

const BasicForm = reduxForm()(({ form, handleSubmit, children }) => (
  <form onSubmit={handleSubmit}>
    {children}
  </form>
));

const RenameVariableButton = ({
  id,
  name,
  children,
  entity,
  type,
  updateVariable,
}) => {
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
            form={`rename-variable-${id}`}
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

RenameVariableButton.propTypes = {
  id: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  updateVariable: PropTypes.func.isRequired,
  name: PropTypes.string,
  children: PropTypes.func.isRequired,
};

RenameVariableButton.defaultProps = {
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

export default withState(RenameVariableButton);
