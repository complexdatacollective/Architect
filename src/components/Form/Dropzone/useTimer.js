import { useRef } from 'react';

const useTimer = () => {
  const timer = useRef();

  const clearTimer = () => {
    if (!timer.current) { return; }
    clearTimeout(timer.current);
  };

  const setTimer = (callback, delay) => {
    clearTimer();
    timer.current = setTimeout(callback, delay);
  };

  return setTimer;
};

export default useTimer;
