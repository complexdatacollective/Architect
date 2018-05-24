import { has, get, defer } from 'lodash';
import anime from 'animejs';
import getAbsoluteBoundingRect from '../../utils/getAbsoluteBoundingRect';
import store from './store';

const defaults = {
  before: 500,
  duration: 500,
  after: 300,
};

const defaultRect = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
};

const tween = (options) => {
  const { name, from, to, before, after, duration } = { ...defaults, ...options };
  const root = document.getElementsByTagName('body')[0];
  const state = store.getState();

  if (!has(state, [name, from]) || !has(state, [name, to])) { return; }

  const fromTarget = get(state, [name, from]);
  const toTarget = get(state, [name, to]);

  const Clone = fromTarget.node.cloneNode(true);

  const fromBounds = {
    ...defaultRect,
    ...getAbsoluteBoundingRect(fromTarget.node),
  };

  const toBounds = {
    ...defaultRect,
    ...getAbsoluteBoundingRect(toTarget.node),
  };

  Clone.style.position = 'absolute';
  Clone.style.zIndex = 'var(--z-fx)';
  Clone.style.transform = 'translateZ(0)';
  Clone.style.top = `${fromBounds.top}px`;
  Clone.style.left = `${fromBounds.left}px`;
  Clone.style.width = `${fromBounds.width}px`;
  Clone.style.height = `${fromBounds.height}px`;
  Clone.style.transformOrigin = 'top left';
  Clone.classList.add(`tween-${name}`);

  root.appendChild(Clone);

  // Force repaint
  Clone.scrollTop; // eslint-disable-line

  Clone.classList.add(`tween-${name}-before`);

  setTimeout(() => {
    Clone.classList.add(`tween-${name}-active`);
  }, before);

  setTimeout(() => {
    Clone.classList.add(`tween-${name}-after`);
  }, (before + duration));

  const beforeAnimation = {
    targets: Clone,
    elasticity: 0,
    easing: [0.25, 0.1, 0.25, 1],
    duration: before,
  };

  const activeAnimation = {
    targets: Clone,
    elasticity: 0,
    easing: [0.25, 0.1, 0.25, 1],
    duration,
    translateY: [0, toBounds.top - fromBounds.top],
    translateX: [0, toBounds.left - fromBounds.left],
    scaleX: [1, toBounds.width / fromBounds.width],
    scaleY: [1, toBounds.height / fromBounds.height],
  };

  const afterAnimation = {
    targets: Clone,
    elasticity: 0,
    easing: [0.25, 0.1, 0.25, 1],
    duration: after,
  };

  anime.timeline()
    .add(beforeAnimation)
    .add(activeAnimation)
    .add(afterAnimation)
    .finished
    .then(() => {
      root.removeChild(Clone);
    });
};

// defer waits until next callstack, this is to allow for time for react elements to exist for
// tweening, with r16 async rendering, this may break.
export default (...args) => defer(() => tween(...args));
