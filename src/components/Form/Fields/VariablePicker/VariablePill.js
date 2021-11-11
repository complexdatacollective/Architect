import React, {
  useMemo, useEffect, useRef, useState,
} from 'react';
import { Icon } from '@codaco/ui';
import Tippy from '@tippyjs/react';
import {
  AnimatePresence,
  motion,
  useAnimation,
} from 'framer-motion';
import { get } from 'lodash';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';
import { requiredWithMessage, uniqueByList, allowedVariableName } from '@app/utils/validations';
import TextInput from '@codaco/ui/lib/components/Fields/Text';
import { getAllVariableUUIDs, makeGetVariableFromUUID, getCodebook } from '../../../../selectors/codebook';
import { getColorForType, VARIABLE_TYPES } from '../../../../config/variables';
import { createSelector } from 'reselect';

const getIconFromType = (type) => get(VARIABLE_TYPES, `${type}.icon`, null);

const selectExistingVariables = createSelector(
  getCodebook,
  (codebook) => getAllVariableUUIDs(codebook),
);

const VariablePill = (props) => {
  const {
    editable,
    uuid,
    onClick: clickHandler,
  } = props;

  console.log('VariablePill', props);
  const animation = useAnimation();
  const dispatch = useDispatch();
  const ref = useRef();

  const [editing, setIsEditing] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [validation, setValidation] = useState(null);

  const { name, type } = useSelector(makeGetVariableFromUUID(uuid));
  const [newName, setNewName] = useState(name);
  const icon = getIconFromType(type);

  const handleCancel = () => {
    setIsEditing(false);
    setValidation(null);
    setNewName(name);
  };

  const handleBlur = (e) => {
    // relatedTarget is the element that the focus event was fired from
    const target = get(e, 'relatedTarget.id', null);

    // Don't cancel if the user clicked the submit button
    if (target === 'editCompleteButton') { return; }
    handleCancel();
  };

  const onEditComplete = () => {
    const action = codebookActions.updateVariableByUUID(uuid, { name: newName }, true);
    dispatch(action);
    setValidation(null);
  };

  const existingVariables = useSelector(selectExistingVariables);

  const existingVariableNames = useMemo(() => existingVariables.map((variable) => get(variable, 'name')));

  const handleUpdateName = (event) => {
    const { target: { value } } = event;
    setNewName(value);

    const required = requiredWithMessage('You must enter a variable name', true)(value);
    const unique = uniqueByList(existingVariableNames)(value);
    const allowed = allowedVariableName()(value);

    const validName = required || unique || allowed || undefined;
    setValidation(validName);
    setCanSubmit(!validName);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (canSubmit) {
        onEditComplete();
      }
    }
  };

  useEffect(() => {
    if (editing) {
      setIsEditing(false);
      animation.start({
        boxShadow: [
          '0 0 0 0 rgba(var(--color-sea-green---rgb), 0.8)',
          '0 0 0 3rem rgba(var(--color-sea-green---rgb), 0)',
          '0 0 0 0 rgba(var(--color-sea-green---rgb), 0)',
        ],
        transition: { duration: 1.5, times: [0, 0.7, 1] },
      });
    }
  }, [name]);

  const classes = cx(
    'variable-pill',
    { 'variable-pill--editable': editable },
  );

  return (
    <>
      <motion.div
        className={classes}
        ref={ref}
        onClick={!editing ? clickHandler : undefined}
        animate={animation}
      >
        <div className="variable-pill__icon" style={{ backgroundColor: getColorForType(type) }}>
          <img className="icon" src={icon} alt={type} />
        </div>
        <div className="variable-pill__container">
          <AnimatePresence initial={false} exitBeforeEnter>
            { editable && editing ? (
              <motion.div
                key="edit"
                style={{ flex: 1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ }}
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
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { delay: 0.5 } }}
                        >
                          <div
                            role="button"
                            tabIndex="0" // Needed to allow focus
                            id="editCompleteButton"
                            onClick={onEditComplete}
                            className={cx('edit-buttons__button', { 'edit-buttons__button--disabled': !canSubmit })}
                          >
                            <Icon name="tick" />
                          </div>
                          <div
                            role="button"
                            tabIndex="0" // Needed to allow focus
                            onClick={handleCancel}
                            className="edit-buttons__button edit-buttons__button--cancel"
                          >
                            <Icon name="cross" color="tomato" />
                          </div>
                        </motion.div>
                      )}
                    />
                  </div>
                </Tippy>
              </motion.div>
            ) : (
              <motion.h4 key="label" transition={{ }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{name}</motion.h4>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      { editable && !editing && (
        <Tippy
          reference={ref}
          interactive
          delay={[750, 500]}
          content={(
            <>
              <div
                className="variable-pill__edit-tooltip"
                onClick={() => setIsEditing(true)}
                role="button"
                tabIndex={0}
              >
                <Icon name="edit" />
                &nbsp;
                <span>Rename</span>
              </div>
            </>
          )}
        />
      )}
    </>
  );
};

export default VariablePill;
