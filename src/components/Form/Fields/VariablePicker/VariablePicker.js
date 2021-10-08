import React, { useState } from 'react';
import { Button, Icon, Modal, Scroller } from '@codaco/ui';
import Search from '@codaco/ui/lib/components/Fields/Search';
import { motion } from 'framer-motion';

const VariablePill = (props) => {
  const {
    name,
    type,
    icon = 'menu-ord'
  } = props;

  return (
    <div className="variable-pill">
      <div className="variable-pill__icon">
        <Icon name="menu-sociogram" />
      </div>
      <div className="variable-pill__container">
        <h6>{name}</h6>
      </div>
    </div>
  );
};

const VariablePicker = (props) => {
  const [showPicker, setShowPicker] = useState(false);

  const {
    name,
    label = 'Select a Variable',
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
  };

  return (
    <>
      <div className="form-fields-variable-picker">
        <fieldset>
          <legend>{label}</legend>
          {value ? (
            <VariablePill
              onClick={() => setShowPicker(true)}
              name={value}
            />
          ) : (
            <Button
              icon="add"
              onClick={() => setShowPicker(true)}
            >
              Select a variable
            </Button>
          )}
        </fieldset>
      </div>
      <Modal show={showPicker} onBlur={() => setShowPicker(false)}>
        <VariableSpotlight onSelect={handleSelectVariable} />
      </Modal>
    </>
  );
};

const VariableSpotlight = (props) => {
  const {
    onSelect
  } = props;

  const [filterTerm, setFilterTerm] = useState(null);

  const items = [...Array(100).map((_, i) => i)];

  const list = filterTerm ? items.includes(filterTerm) : items;

  return (
    <div className="variable-spotlight">
      <header className="variable-spotlight__header">
        <Search />
      </header>
      <div className="variable-spotlight__list">
        <Scroller>
          {list.map((item) => (
            <motion.div
              key={item}
              layout
              onClick={() => onSelect(item)}
            >
              <VariablePill name={item} />
            </motion.div>
          ))}
        </Scroller>
      </div>
    </div>
  );
};

export default VariablePicker;
