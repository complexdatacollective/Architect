import React, { useContext, useEffect, useState } from 'react';
import uuid from 'uuid';

const initialState = { items: [], setItems: () => {} };

const StackContext = React.createContext(initialState);

const StackProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const contextValue = {
    items,
    setItems,
  };

  return (
    <StackContext.Provider value={contextValue}>
      {children}
    </StackContext.Provider>
  );
};

// example usage in component
// const MyComponent = ({ setValue }) => {
//   const handleUpdate = (value) => {
//     setValue(value);
//   };

//   const [updateWindow] = useStackable(MyWindowComponent, { handleUpdate, open: false });

//   const handleClickThing = () => {
//     updateWindow({ open: true });
//   };

//   return (
//     <div>

//     </div>
//   );
// };
const useStack = (Component, props = {}, Context = StackContext) => {
  const [itemId] = useState(() => uuid());
  const { items, setItems } = useContext(Context);
  const itemIndex = items.findIndex(([id]) => id === itemId);

  const update = (newProps = {}, merge = true) => {
    const [,, prevProps] = items[itemIndex];
    const updatedProps = merge ?
      { ...prevProps, ...newProps } :
      newProps;
    const newEntry = [itemId, Component, updatedProps];

    const newItems = [
      ...items.slice(0, itemIndex - 1),
      newEntry,
      ...items.slice(itemIndex + 1),
    ];

    setItems(newItems);
  };

  useEffect(() => {
    const newEntry = [itemId, Component, props];

    const newItems = itemIndex !== -1 ?
      [
        ...items.slice(0, itemIndex - 1),
        newEntry,
        ...items.slice(itemIndex + 1),
      ] :
      [
        ...items,
        newEntry,
      ];

    setItems(newItems);

    return () => {
      setItems(items.filter(([id]) => id === itemId));
    };
  }, [itemId]);

  return [update];
};

const Stack = ({ context }) => {
  const { items } = useContext(context);

  if (!items) { return null; }

  return items.map(
    ([id, Component, props], index) => (
      <Component {...props} key={id} index={index} />
    ),
  );
};

Stack.defaultProps = {
  context: StackContext,
};

export default Stack;

export {
  useStack,
  StackContext,
  StackProvider,
};
