import React, {
  useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@codaco/ui';
import Tippy from '@tippyjs/react';
import {
  AnimatePresence,
  motion,
} from 'framer-motion';
import { get } from 'lodash';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';
import { required as requiredValidation, uniqueByList, allowedVariableName } from '@app/utils/validations';
import TextInput from '@codaco/ui/lib/components/Fields/Text';
import { makeGetVariableWithEntity, getVariablesForSubject } from '../../../../selectors/codebook';
import { getColorForType, getIconForType } from '../../../../config/variables';

const EDIT_COMPLETE_BUTTON_ID = 'editCompleteButton';

export const BaseVariablePill = React.forwardRef((props, ref) => {
  const {
    type,
    children,
  } = props;

  const icon = useMemo(() => getIconForType(type), [type]);
  const backgroundColor = useMemo(() => getColorForType(type), [type]);

  return (
    <motion.div className="variable-pill" ref={ref}>
      <div className="variable-pill__icon" style={{ backgroundColor }}>
        <img className="icon" src={icon} alt={type} />
      </div>
      <div className="variable-pill__container">
        {children}
      </div>
    </motion.div>
  );
});

BaseVariablePill.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
};

BaseVariablePill.defaultProps = {
  type: null,
};

export const SimpleVariablePill = ({ label, ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <BaseVariablePill {...props}>
    <motion.h4>
      {label}
    </motion.h4>
  </BaseVariablePill>
);

SimpleVariablePill.propTypes = {
  label: PropTypes.string.isRequired,
};

const EditableVariablePill = ({ uuid }) => {
  const dispatch = useDispatch();
  const ref = useRef();

  const [editing, setIsEditing] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [validation, setValidation] = useState(null);

  const {
    name, type, entity, entityType,
  } = useSelector(makeGetVariableWithEntity(uuid));

  const [newName, setNewName] = useState(name);

  const handleCancel = () => {
    setIsEditing(false);
    setValidation(null);
    setNewName(name);
  };

  const handleBlur = (e) => {
    // relatedTarget is the element that the focus event was fired from
    const target = get(e, 'relatedTarget.id', null);

    // Don't cancel if the user clicked the submit button
    if (target === EDIT_COMPLETE_BUTTON_ID) { return; }
    handleCancel();
  };

  const onEditComplete = () => {
    const action = codebookActions.updateVariableByUUID(uuid, { name: newName }, true);
    dispatch(action);
    setValidation(null);
    setIsEditing(false);
  };

  const existingVariables = useSelector(
    (state) => getVariablesForSubject(state, { entity, type: entityType }),
  );

  const existingVariableNames = useMemo(() => Object.keys(existingVariables).map((variable) => get(existingVariables[variable], 'name')));

  const handleUpdateName = (event) => {
    const { target: { value } } = event;
    setNewName(value);

    const required = requiredValidation(true, 'You must enter a variable name', true)(value);
    const unique = uniqueByList(existingVariableNames)(value);
    const allowed = allowedVariableName()(value);

    const validationResult = required || unique || allowed || undefined;
    setValidation(validationResult);
    setCanSubmit(!validationResult);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent any parent form from submitting

      if (canSubmit) {
        onEditComplete();
      }
    }
  };

  return (
    <>
      <BaseVariablePill type={type} ref={ref}>
        <AnimatePresence initial={false} exitBeforeEnter>
          {editing ? (
            <motion.div
              key="edit"
              style={{ flex: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Tippy
                theme="error"
                content={validation}
                visible={!!validation}
                placement="bottom"
              >
                <div style={{ width: '100%', flex: '1 auto' }}>
                  <TextInput
                    autoFocus
                    placeholder="Enter a new variable name..."
                    input={{
                      value: newName,
                      onChange: handleUpdateName,
                      onBlur: handleBlur,
                      onKeyDown: handleKeyDown,
                    }}
                    adornmentRight={(
                      <motion.div
                        className="edit-buttons"
                      >
                        <motion.div
                          title="Finished"
                          aria-label="Finished"
                          initial={{ x: '100%', opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          role="button"
                          tabIndex="0" // Needed to allow focus
                          id={EDIT_COMPLETE_BUTTON_ID}
                          onClick={onEditComplete}
                          className={cx('edit-buttons__button', { 'edit-buttons__button--disabled': !canSubmit })}
                        >
                          <Icon name="tick" />
                        </motion.div>
                        <motion.div
                          title="Cancel"
                          aria-label="Cancel"
                          initial={{ x: '100%', opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          role="button"
                          tabIndex="0" // Needed to allow focus
                          onClick={handleCancel}
                          className="edit-buttons__button edit-buttons__button--cancel"
                        >
                          <Icon name="cross" color="tomato" />
                        </motion.div>
                      </motion.div>
                    )}
                  />
                </div>
              </Tippy>
            </motion.div>
          ) : (
            <motion.h4
              key="label"
              className="label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(true)}
              title="Click to rename this variable..."
            >
              {name}
            </motion.h4>
          )}
        </AnimatePresence>
      </BaseVariablePill>
    </>
  );
};

EditableVariablePill.propTypes = {
  uuid: PropTypes.string.isRequired,
};

export default React.memo(EditableVariablePill);
