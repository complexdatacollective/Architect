import { useState } from 'react';

const Tabs = ({ children }) => {
  const [state, setState] = useState(0);

  return children({ selectedTab: state, selectTab: setState });
};

export default Tabs;
