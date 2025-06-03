import scrollparent from 'scrollparent';

const scrollTo = (target, offset = -200) => {
  if (!target) { return; }
  const scroller = scrollparent(target);

  // Get the target's position relative to the viewport
  const targetRect = target.getBoundingClientRect();

  // Get the scroller's position relative to the viewport
  const scrollerRect = scroller.getBoundingClientRect();

  // Calculate the target's position relative to the scroller's content
  // This accounts for the scroller's current scroll position and target's position
  const targetPositionInScroller = targetRect.top - scrollerRect.top + scroller.scrollTop;

  // Apply the offset and scroll to the final position
  const scrollEnd = targetPositionInScroller + offset;

  scroller.scrollTo({
    top: scrollEnd,
    behavior: 'smooth',
  });
};

export default scrollTo;
