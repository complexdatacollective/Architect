import React, { useMemo, useState } from 'react';
import {
  Button, Icon, Modal, Scroller,
} from '@codaco/ui';
import Tippy from '@tippyjs/react/headless'; // different import path!
import Search from '@codaco/ui/lib/components/Fields/Search';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { get, isEmpty, values } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';
import { required, uniqueByList, allowedVariableName } from '@app/utils/validations';
import { getVariablesForSubject } from '../../../../selectors/codebook';

const isRequired = required();
const isAllowedVariableName = allowedVariableName();

const VariablePill = (props) => {
  const {
    editable,
    uuid,
  } = props;

  const icon = 'menu-ord';

  const type = 'ordinal';

  const dispatch = useDispatch();

  // const onEditComplete = (value) => {
  //   const action = codebookActions.updateVariable(entity, type, id, { name: value}, true);
  //   dispatch(action);
  // };

  const entityDefinition = useSelector((state) => {
    console.log(state);

    return { entity: state.entity, type: state.type };
  });
  const name = get(entityDefinition, ['variables', uuid, 'name'], '');

  const existingVariables = useSelector(getVariablesForSubject);

  const existingVariableNames = values(existingVariables)
    .map((variable) => variable.name);

  console.log(entityDefinition, name);

  const validate = useMemo(() => ([
    isRequired,
    uniqueByList(existingVariableNames),
    isAllowedVariableName,
  ]), [existingVariableNames.join()]);

  return (
    <div className="variable-pill">
      <div className="variable-pill__icon">
        <Icon name="menu-sociogram" />
      </div>
      <div className="variable-pill__container">
        <h6 contentEditable>{uuid}</h6>
        <div className="edit-buttons">
          <Icon name="tick" style={{ height: '1.2rem' }} />
          <Icon name="cross" color="tomato" style={{ height: '1.2rem' }} />
        </div>
      </div>
    </div>
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
              <Tippy
                interactive
                render={attrs => (
                  <div className="variable-pill__editor" tabIndex="-1" {...attrs}>
                    <Button icon="edit" />
                  </div>
                )}
              >
                <span onClick={() => setShowPicker(true)} key={value}>
                  <VariablePill
                    uuid={value}
                    editable
                  />
                </span>
              </Tippy>
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
            height: '90vh',
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
              <AnimatePresence initial={false}>
                {getFilteredList().map(({ value }) => (
                  <motion.div
                    // tabIndex="0"
                    // role="option"
                    key={value}
                    layout
                    onClick={() => onSelect(value)}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    initial={{
                      scale: 0,
                      opacity: 0,
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                    }}
                  >
                    <VariablePill uuid={value} />
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
