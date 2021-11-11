import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Scroller } from '@codaco/ui';
import cx from 'classnames';
import Search from '@codaco/ui/lib/components/Fields/Search';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { get, isEmpty } from 'lodash';
import VariablePill from './VariablePill';

const ListItem = ({
  selected, onSelect, children, setSelected,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (selected) {
      // Move element into view when it is selected
      ref.current.scrollIntoView({ block: 'nearest' });
    }
  }, [selected]);

  const classes = cx(
    'spotlight-list-item',
    { 'spotlight-list-item--selected': selected },
    { 'spotlight-list-item--clickable': onSelect },
  );

  return (
    <li
      onMouseEnter={setSelected}
      ref={ref}
      className={classes}
      onClick={onSelect}
      role="button"
    >
      {children}
      { selected && (
        <kbd>
          Enter&nbsp;&#8629;
        </kbd>
      )}
    </li>
  );
};

const Divider = ({ legend }) => (
  <ListItem>
    <fieldset
      className="featured-header"
      style={{
        borderTop: '2px solid white',
        width: '100%',
      }}
    >
      <legend>{legend}</legend>
    </fieldset>
  </ListItem>
);

const VariableSpotlight = (props) => {
  const {
    onSelect,
    onCreateOption,
    options,
  } = props;

  const [filterTerm, setFilterTerm] = useState('');
  const [cursor, setCursor] = useState(-2);

  const handleCreateOption = async () => {
    console.log('handleCreateOption', filterTerm);
    onCreateOption(filterTerm);
  };

  const filteredItems = useMemo(() => {
    if (!filterTerm) { return options; }
    return options.filter((item) => item.label.includes(filterTerm));
  }, [filterTerm, options]);

  console.log(filteredItems);

  const renderResults = () => (
    <Scroller>
      <ol>
        { filterTerm && (
          <>
            <Divider legend="Create new Variable" />
            <ListItem
              onSelect={handleCreateOption}
              selected={cursor === -1}
            >
              <div className="create-new">
                + Create new Variable called
                &nbsp;
                <pre>
                  {filterTerm}
                </pre>
              </div>
            </ListItem>
          </>
        )}
        <Divider legend="Search Results" />
        { filteredItems.map(({ value }, index) => (
          <ListItem key={value} selected={cursor === index} onSelect={() => setCursor(index)}>
            <VariablePill uuid={value} />
          </ListItem>
        ))}
      </ol>
    </Scroller>
  );

  useEffect(() => {
    console.log('resetCursor', cursor, filteredItems.length - 1, filteredItems);
    if (cursor > filteredItems.length - 1) {
      console.log('oob');
      setCursor(filteredItems.length - 1);
      return;
    }

    if (cursor < 0 && !filterTerm.length > 0) {
      console.log('zeroing');
      setCursor(0);
    }
  }, [filteredItems, filterTerm]);

  const handleFilter = (e) => {
    const value = get(e, 'target.value', '');
    setFilterTerm(value);
  };

  // Navigate within the list of results using the keyboard
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault(); // Prevent moving cursor within input

      if ((filterTerm.length > 0 && cursor > -1) || cursor > 0) {
        setCursor(cursor - 1);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); // Prevent moving cursor within input
      if (cursor < filteredItems.length - 1) {
        setCursor(cursor + 1);
      }
    } else if (e.key === 'Enter') {
      if (cursor > -1) {
        onSelect(filteredItems[cursor].value);
        return;
      }

      if (filterTerm) {
        handleCreateOption();
      }
    }
  };

  console.log('cursor', cursor);

  return (
    <>
      <div className="variable-spotlight">
        <header className="variable-spotlight__header">
          <Search
            autoFocus
            placeholder="Search existing variables or type the name of a new variable..."
            input={{
              value: filterTerm,
              onChange: handleFilter,
              onKeyDown: handleKeyDown,
            }}
          />
        </header>
        <main
          className="variable-spotlight__list"
        >
          { renderResults() }
        </main>
      </div>
    </>
  );
};

export default VariableSpotlight;
