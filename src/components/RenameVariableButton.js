import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { get } from 'lodash';
import { Button } from '@codaco/ui';
import TextField from '@codaco/ui/lib/components/Fields/Text';
import { getType } from '@selectors/codebook';
import ContextualDialog, { Controls } from '@components/ContextualDialog';

const BasicForm = reduxForm()(({ form, handleSubmit, children }) => (
  <form onSubmit={handleSubmit}>
    {children}
  </form>
));

const RenameVariableButton = ({
  id,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSubmit = useCallback((values) => {
    const { name: newName } = values;
    console.log({ newName });
    setIsOpen(false);
  }, []);

  const controls = [
    <Button
      onClick={handleClose}
      color="white"
    >
      Close
    </Button>,
    <Button type="submit">
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
    <div className="rename-variable">
      <button
        type="button"
        onClick={handleOpen}
      >
        Rename
      </button>
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
            <Field component={TextField} name="name" />

            <Controls>
              {controls}
            </Controls>
          </BasicForm>
        </ContextualDialog>
      )}
    </div>
  );
};

RenameVariableButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
};

RenameVariableButton.defaultProps = {
  name: null,
};

const mapStateToProps = (state, { entity, type, id }) => {
  const entityDefinition = getType(state, { entity, type });
  const name = get(entityDefinition, ['variables', id, 'name'], '');
  return { name };
};

export default connect(mapStateToProps)(RenameVariableButton);
