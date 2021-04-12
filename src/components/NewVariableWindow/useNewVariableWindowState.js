import { useState, useRef, useEffect } from 'react';

const useNewVariableWindowState = (initialProps, onComplete) => {
  const [meta, setMeta] = useState({});
  const [dynamicProps, setDynamicProps] = useState({});
  const [windowOpen, setWindowOpen] = useState(false);
  const handleOnComplete = useRef();

  const closeWindow = () => setWindowOpen(false);

  useEffect(() => {
    handleOnComplete.current = (...args) => {
      onComplete(...args, meta);
      closeWindow();
    };
  }, [meta]);

  const openWindow = (newProps, newMeta) => {
    setDynamicProps((prevProps) => ({
      ...prevProps,
      ...newProps,
    }));
    setMeta(newMeta);
    setWindowOpen(true);
  };

  const windowProps = {
    onComplete: (id) => handleOnComplete.current(id),
    onCancel: closeWindow,
    show: windowOpen,
    ...initialProps,
    ...dynamicProps,
  };

  return [windowProps, openWindow, closeWindow];
};

export default useNewVariableWindowState;
