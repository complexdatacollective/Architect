import anime from 'animejs';
import scrollparent from 'scrollparent';
import { getCSSVariableAsObject, getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';

const scrollTo = (destination, offset = 0) => {
  if (!destination) { return; }
  const scroller = scrollparent(destination);
  const scrollStart = scroller.scrollTop;
  const destinationOffset = parseInt(destination.getBoundingClientRect().top, 10);
  const scrollEnd = scrollStart + destinationOffset + offset;

  anime({
    targets: scroller,
    scrollTop: scrollEnd,
    easing: getCSSVariableAsObject('--animation-easing-js'),
    duration: getCSSVariableAsNumber('--animation-duration-fast-ms'),
  });
};

export default scrollTo;
