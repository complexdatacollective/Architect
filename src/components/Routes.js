import React from 'react';
import { useSelector } from 'react-redux';
import Home from '@components/Home/Home';
import Protocol from '@components/Protocol';
import Loading from '@components/Loading';
import Screens from '@components/Screens';
import { getActiveProtocol } from '@selectors/session';

const Routes = () => {
  const activeProtocol = useSelector(getActiveProtocol);

  const route = activeProtocol ? <Protocol /> : <Home />;

  return (
    <>
      <Screens />
      {route}
      <Loading />
    </>
  );
};

export default Routes;
