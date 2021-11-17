import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import { Icon, Scroller } from '@codaco/ui';
import cx from 'classnames';
import { uniqueByList, allowedVariableName } from '@app/utils/validations';
import Search from '@codaco/ui/lib/components/Fields/Search';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import VariablePill from './VariablePill';
import { getVariablesForSubject } from '../../../../selectors/codebook';

const ListItem = ({
  disabled,
  selected,
  onSelect,
  children,
  setSelected,
  removeSelected = () => {},
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
    { 'spotlight-list-item--disabled': disabled },
  );

  return (
    <li
      onMouseEnter={setSelected}
      onMouseLeave={removeSelected}
      ref={ref}
    >
      <div
        className={classes}
        onClick={onSelect}
      >
        {children}
        { selected && (
          <kbd>
            Enter&nbsp;&#8629;
          </kbd>
        )}
      </div>
    </li>
  );
};

const Divider = ({ legend }) => (
  <ListItem>
    <fieldset className="divider-header">
      <legend>{legend}</legend>
    </fieldset>
  </ListItem>
);

const VariableSpotlight = (props) => {
  const {
    entity,
    type,
    onSelect,
    onCancel,
    onCreateOption,
    options,
  } = props;

  const [filterTerm, setFilterTerm] = useState('');

  // Cursor positions:
  // -2: Search input
  // -1: Create option (if visible)
  // 0-n: Existing variables
  const [cursor, setCursor] = useState(-2);
  const [showCursor, setShowCursor] = useState(false);

  const handleCreateOption = async () => {
    onCreateOption(filterTerm);
  };

  const filteredItems = useMemo(() => {
    if (!filterTerm) { return options; }
    return options.filter((item) => item.label.includes(filterTerm));
  }, [filterTerm, options]);

  const existingVariables = useSelector(
    (state) => getVariablesForSubject(state, { entity, type }),
  );

  const existingVariableNames = useMemo(() => Object.keys(existingVariables).map((variable) => get(existingVariables[variable], 'name')));

  const invalidVariableName = useMemo(() => {
    const unique = uniqueByList(existingVariableNames)(filterTerm);
    const allowed = allowedVariableName()(filterTerm);

    return unique || allowed || undefined;
  }, [filterTerm, existingVariableNames]);

  const renderResults = () => (
    <Scroller>
      <ol>
        { filterTerm && options.filter((item) => item.label === filterTerm).length !== 1 && (
          <>
            <Divider legend="Create" />
            { !invalidVariableName ? (
              <ListItem
                onSelect={handleCreateOption}
                selected={showCursor && cursor === -1}
                setSelected={() => { setShowCursor(true); setCursor(-1); }}
                removeSelected={() => setCursor(0)}
              >
                <div className="create-new">
                  <Icon name="add" />
                  <span>
                    Create new variable called &quot;
                    {filterTerm}
                    &quot;.
                  </span>
                </div>
              </ListItem>
            ) : (
              <ListItem disabled>
                <div className="create-new">
                  <Icon name="warning" />
                  <span>
                    Cannot create variable named &quot;
                    {filterTerm}
                    &quot;&nbsp;&mdash;&nbsp;
                    {invalidVariableName}
                    .
                  </span>
                </div>
              </ListItem>
            )}
          </>
        )}
        { filteredItems.length > 0 && (
          <Divider
            legend={filterTerm.length > 0 ? `Existing Variables Containing "${filterTerm}"` : 'Existing Variables'}
          />
        )}
        { filteredItems.map(({ value, label }, index) => (
          <ListItem
            key={value}
            onSelect={() => onSelect(value)}
            selected={showCursor && (cursor === index || label === filterTerm)}
            setSelected={() => { setShowCursor(true); setCursor(-1); }}
            removeSelected={() => setCursor(-1)}
          >
            <VariablePill uuid={value} />
          </ListItem>
        ))}
      </ol>
    </Scroller>
  );

  // Reset cursor position when list is filtered
  useEffect(() => {
    if (cursor > filteredItems.length - 1) {
      setCursor(filteredItems.length - 1);
      return;
    }

    if (cursor === 0 && !filterTerm.length > 0) {
      setCursor(0);
    }
  }, [filteredItems, filterTerm, cursor]);

  const handleFilter = (e) => {
    const value = get(e, 'target.value', '');
    setFilterTerm(value);
  };

  // Navigate within the list of results using the keyboard
  const handleKeyDown = (e) => {
    // Close the picker when pressing escape
    if (e.key === 'Escape') {
      onCancel();
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault(); // Prevent moving cursor within search input

      // Show the cursor only when either arrow key is pressed for the first time
      if (!showCursor) {
        setShowCursor(true);
      }
    }

    if (e.key === 'ArrowUp') {
      // If there are items and the cursor is not at the top,
      // or if there are no items and the cursor is not at the top
      // move the cursor up
      if ((filterTerm.length > 0 && cursor > -1) || cursor > 0) {
        setCursor(cursor - 1);
      }
    } else if (e.key === 'ArrowDown') {
      // If there is no filterTerm and the cursor is in the search input,
      // or if the filterterm is invalid and the cursor is in the search input,
      // move the cursor to the first item
      if (
        (filterTerm.length === 0 && cursor === -2)
        || (cursor === -2 && invalidVariableName)
      ) {
        setCursor(0);
        return;
      }

      // If the cursor is not at the bottom
      // Or there are no items and the cursor is in the search input
      // move the cursor down
      if ((cursor < filteredItems.length - 1) || (filterTerm.length === 0 && cursor === -2)) {
        setCursor(cursor + 1);
      }
    } else if (e.key === 'Enter') {
      // If the cursor is within the list of results, select the value
      if (cursor > -1) {
        onSelect(filteredItems[cursor].value);
        return;
      }

      // If the cursor is in the create option,
      // and there is a filter term,
      // create a new variable with that value
      if (filterTerm && cursor === -1) {
        handleCreateOption();
      }
    }
  };

  return (
    <>
      <div className="variable-spotlight">
        <header className="variable-spotlight__header">
          <Search
            autoFocus
            placeholder="Find or create a variable..."
            input={{
              value: filterTerm,
              onChange: handleFilter,
              onKeyDown: handleKeyDown,
            }}
          />
        </header>
        <motion.main
          className="variable-spotlight__list"
          initial={{ height: 0 }}
          animate={{ height: 'auto', transition: { delay: 0.5 } }}
        >
          { renderResults() }
        </motion.main>
      </div>
    </>
  );
};

export default VariableSpotlight;
