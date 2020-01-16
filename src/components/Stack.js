import React, { useContext, useEffect, useState, useRef } from 'react';
import uuid from 'uuid';

// Example Usage
// const MyComponent = ({ showWindow }) => {
//   useStack(({ index, stackKey }) => (
//     <WindowLikeComponent
//       index={index}
//       key={stackKey}
//       show={showWindow}
//     />
//   ), [showWindow]); // any properties that require re-render
//   return (
//     <div>
//       This can be unrelated content
//     </div>
//   );
// };
// const ParentComponent = ({ showWindow }) => {
//   return (
//     <div>
//       <StackProvider>
//         <Stacks /> {/* WindowLikeComponent is rendered here */}
//         <MyComponent />
//       </StackProvider>
//     </div>
//   );
// };

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

const useStack = (component, watchProps = [], Context = StackContext) => {
  const [itemId] = useState(() => uuid());
  const { items, setItems } = useContext(Context);
  const componentRef = useRef(component);

  const itemIndex = items.findIndex(([id]) => id === itemId);

  useEffect(() => {
    componentRef.current = component;
  }, [component]);

  useEffect(() => {
    const newEntry = [itemId, componentRef];

    setItems(_items => ([
      ..._items,
      newEntry,
    ]));

    return () => {
      setItems(_items => _items.filter(([id]) => id === itemId));
    };
  }, [itemId]);

  useEffect(() => {
    if (itemIndex === -1) { return; }

    setItems(_items => [
      ..._items.filter(([id]) => id !== itemId),
      [itemId, componentRef],
    ]);
  }, [itemIndex, ...watchProps]);
};

const Stack = ({ context }) => {
  const { items } = useContext(context);

  if (!items) { return null; }

  return items.map(
    ([id, componentRef], index) =>
      componentRef.current({ key: id, index }),
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
