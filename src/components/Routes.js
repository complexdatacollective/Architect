import React from 'react';
import { useSelector } from 'react-redux';
import { AnimateSharedLayout } from 'framer-motion';
import Home from '@components/Home/Home';
import Protocol from '@components/Protocol';
import Loading from '@components/Loading';
import Screens from '@components/Screens';
import { getActiveProtocol } from '@selectors/session';
import { getScreensStack } from '@selectors/ui';

const getRoute = ({
  activeProtocol,
}) => {
  if (activeProtocol) { return <Protocol />; }
  return <Home />;
};

const Routes = () => {
  const activeProtocol = useSelector(getActiveProtocol);
  const screens = useSelector(getScreensStack);
  const route = getRoute({ activeProtocol, screens });

  return (
    <AnimateSharedLayout>
      <Screens />
      {route}
      <Loading />
    </AnimateSharedLayout>
  );
};

export default Routes;
