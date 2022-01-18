import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getScreensStack } from '@selectors/ui';
import { actionCreators as uiActions } from '@modules/ui';
import { getScreenComponent } from './screenIndex';

export const screenVariants = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      duration: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
};

/**
 * Screen manager for Architect.
 *
 * Any screens present in the `screens` redux state will be rendered by this
 * component.
 *
 * Screens can be opened and closed using the screen module actions:
 * - `openScreen(name, params)`:
 *    `name` is used to find the screen component (screens are listed by name in screenIndex),
 *     and `params` are passed to screen component itself
 *    This will be rendered as `<ScreenComponent {...params} />`
 * - `closeScreen(name, params)`
 */
const Screens = () => {
  const screens = useSelector((state) => getScreensStack(state));

  const dispatch = useDispatch();

  const closeScreen = useCallback(
    (name, params) => dispatch(uiActions.closeScreen(name, params)),
    [dispatch],
  );

  // const handleEscape = useCallback((e) => {
  //   if (e.key === 'Escape') {
  //     const lastScreen = screens[screens.length - 1];
  //     if (lastScreen) {
  //       closeScreen(lastScreen.screen, lastScreen.params);
  //     }
  //   }
  // }, [screens, closeScreen]);

  // useEffect(() => {
  //   document.body.addEventListener('keydown', handleEscape);

  //   return () => {
  //     document.body.removeEventListener('keydown', handleEscape);
  //   };
  // }, [screens, closeScreen]);

  const renderScreens = useCallback(() => screens.map(({ screen, params }) => {
    const ScreenComponent = getScreenComponent(screen);

    const onComplete = (result) => closeScreen(screen, result);

    return (
      <motion.div
        key={params.id}
        variants={screenVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="screens-container"
      >
        <ScreenComponent
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          layoutId={params.id}
          onComplete={onComplete}
        />
      </motion.div>
    );
  }), [screens, closeScreen]);

  return createPortal(
    <AnimatePresence>
      {renderScreens()}
    </AnimatePresence>,
    document.body,
  );
};

export default Screens;
