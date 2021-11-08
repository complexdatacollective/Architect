import React, { useMemo, useEffect, useRef, useState } from 'react';
import {
  Button, Icon, Modal, Scroller,
} from '@codaco/ui';
import Tippy from '@tippyjs/react'; // different import path!
import Search from '@codaco/ui/lib/components/Fields/Search';
import { AnimatePresence, AnimateSharedLayout, motion, useAnimation } from 'framer-motion';
import { get, isEmpty, flow } from 'lodash';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';
import { required, uniqueByList, allowedVariableName } from '@app/utils/validations';
import { getAllVariableUUIDs, makeGetVariableFromUUID, getCodebook } from '../../../../selectors/codebook';
import { getColorForType, VARIABLE_TYPES } from '../../../../config/variables';
import TextInput from '@codaco/ui/lib/components/Fields/Text';

const isRequired = required();
const isAllowedVariableName = allowedVariableName();

const getIconFromType = (type) => get(VARIABLE_TYPES, `${type}.icon`, null);

export const VariablePill = (props) => {
  const {
    editable,
    uuid,
    onClick: clickHandler,
  } = props;

  const animation = useAnimation();

  const dispatch = useDispatch();
  const ref = useRef();
  const [editing, setIsEditing] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const { name, type } = useSelector(makeGetVariableFromUUID(uuid));
  const [newName, setNewName] = useState(name);
  const icon = getIconFromType(type);

  const onEditComplete = () => {
    const action = codebookActions.updateVariableByUUID(uuid, { name: newName }, true);
    dispatch(action);
  };

  const existingVariables = useSelector((state) => {
    const codebook = getCodebook(state);
    const variables = getAllVariableUUIDs(codebook);
    console.log({ state, codebook, variables });
    return variables;
  });

  const existingVariableNames = existingVariables.map((variable) => get(variable, 'name'));

  const handleUpdateName = (event) => {
    const value = event.target.value;
    setNewName(value);

    const required = isRequired(value);
    const unique = uniqueByList(existingVariableNames)(value);
    const allowed = isAllowedVariableName(value);
    console.log({ required, unique, allowed });

    const validName = required || unique || allowed || undefined;
    setCanSubmit(!validName);
  };

  const classes = cx(
    'variable-pill',
    { 'variable-pill--clickable': !editing && clickHandler },
  );

  useEffect(() => {
    console.log('useEffect');
    if (editing) {
      setIsEditing(false);
      animation.start({
        boxShadow: [
          '0 0 0 0 rgba(var(--color-sea-green---rgb), 0.8)',
          '0 0 0 3rem rgba(var(--color-sea-green---rgb), 0)',
          '0 0 0 0 rgba(var(--color-sea-green---rgb), 0)'
        ],
        transition: { duration: 1.5, times: [0, 0.7, 1] },
      })
    }
  }, [name]);

  return (
    <AnimateSharedLayout>
      <motion.div
        className={classes}
        ref={ref}
        onClick={!editing ? clickHandler : undefined}
        animate={animation}
        layout
      >
        <motion.div layout className="variable-pill__icon" style={{ backgroundColor: getColorForType(type) }}>
          <img className="icon" src={icon} alt={type} />
        </motion.div>
        <motion.div layout className="variable-pill__container">
          <AnimatePresence initial={false} exitBeforeEnter>
          { editable && editing ? (
            <motion.div style={{ flex: 1 }} initial={{y: '-100%'}} animate={{ y: 0}} exit={{y: '-100%'}}>
              <TextInput
                autoFocus
                placeholder="Enter a new variable name..."
                input={{
                  value: newName,
                  onChange: handleUpdateName,
                }}
                adornmentRight={(
                  <div className="edit-buttons">
                    <div
                      onClick={() => onEditComplete()}
                      className={cx('edit-buttons__button', { 'edit-buttons__button--disabled': !canSubmit })}
                    >
                      <Icon name="tick" />
                    </div>
                    <div
                      onClick={() => setIsEditing(false)}
                      className="edit-buttons__button edit-buttons__button--cancel"
                    >
                      <Icon name="cross" color="tomato" />
                    </div>
                  </div>
                )}
              />
            </motion.div>
          ) : (
            <motion.h4 initial={{y: '100%'}} animate={{ y: 0}} exit={{y: '100%'}}>{name}</motion.h4>
          )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      { editable && !editing && (
        <Tippy
          content={(
            <>
              <div className="variable-pill__editor" onClick={() => setIsEditing(true)}>
                <Icon name="edit" />
                <span>Rename</span>
              </div>
            </>
          )}
          reference={ref}
          interactive
          delay={[750, 100]}
        />
      )}
    </AnimateSharedLayout>
  );
};



const VariablePicker = (props) => {
  const [showPicker, setShowPicker] = useState(false);

  const {
    options,
    label = 'Variable',
    meta: {
      error,
      invalid,
      touched,
    },
    input: {
      value,
      onChange
    }
  } = props;

  const handleSelectVariable = (variable) => {
    onChange(variable);
    setShowPicker(false);
  };

  const variants = {
    show: {
      y: 0,
    },
    hide: {
      y: '-100%',
    },
    exit: {
      opacity: 0,
    },
  };

  const hideModal = () => setShowPicker(false);

  return (
    <>
      <div className="form-fields-variable-picker">
        <fieldset>
          <legend>{label}</legend>
          {value ? (
            <AnimatePresence exitBeforeEnter>
              <VariablePill uuid={value} key={value} editable onClick={() => setShowPicker(true)} />
            </AnimatePresence>
          ) : (
            <Button
              key="picker"
              icon="add"
              onClick={() => setShowPicker(true)}
              size="small"
            >
              Select variable
            </Button>
          )}
          {invalid && touched && (
          <p className="form-fields-variable-picker__error">
            {error}
          </p>
          ) }
        </fieldset>
      </div>
      <Modal show={showPicker} onBlur={hideModal}>
        <div
          style={{
            height: '80vh',
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <VariableSpotlight onSelect={handleSelectVariable} options={options} />
        </div>
      </Modal>
    </>
  );
};

const VariableSpotlight = (props) => {
  const {
    onSelect,
    options,
  } = props;

  const [filterTerm, setFilterTerm] = useState(null);

  const getFilteredList = () => {
    if (!filterTerm) { return options; }
    console.log(options, filterTerm);
    return options.filter((item) => item.label.includes(filterTerm));
  };

  const handleFilter = (e) => {
    const value = get(e, 'target.value', null);
    setFilterTerm(value);
  };

  return (
    <AnimateSharedLayout>
      <motion.div className="variable-spotlight" layout>
        <motion.header className="variable-spotlight__header" layout>
          <Search
            autoFocus
            placeholder="Search existing variables or type the name of a new variable..."
            input={{
              value: filterTerm,
              onChange: handleFilter,
            }}
          />
        </motion.header>
        { isEmpty(getFilteredList()) ? (
          <div className="variable-spotlight__empty">
            <h4>Create new variable</h4>
          </div>
        ) : (
          <motion.div className="variable-spotlight__list" layout>
            <Scroller>
              <AnimatePresence>
                {getFilteredList().map(({ value }, index) => (
                  <motion.div
                    // tabIndex="0"
                    // role="option"
                    key={value}
                    layout
                    onClick={() => onSelect(value)}
                    transition={{ type: 'spring', stiffness: 100 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    initial={{
                      scale: 0,
                      opacity: 0,
                      transition: {
                        delay: index * 0.2,
                      },
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                    }}
                  >
                    <VariablePill uuid={value} key={value} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Scroller>
          </motion.div>
        )}
      </motion.div>
    </AnimateSharedLayout>
  );
};

export default VariablePicker;
