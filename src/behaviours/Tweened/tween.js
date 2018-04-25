import { has, get, defer } from 'lodash';
import anime from 'animejs';

window.Tweens = window.Tweens || [];

const defaults = {
  before: 500,
  duration: 500,
  after: 300,
};

const tween = (options) => {
  const { name, from, to, before, after, duration } = { ...defaults, ...options };
  const root = document.getElementsByTagName('body')[0];

  if (!has(window.Tweens, name)) { return; }

  const fromTarget = get(window.Tweens, [name, from]);
  const toTarget = get(window.Tweens, [name, to]);

  const Clone = fromTarget.node.cloneNode(true);

  Clone.style.position = 'absolute';
  Clone.style.zIndex = 1000;
  Clone.style.transform = 'translateZ(0)';
  Clone.style.top = `${get(fromTarget, 'top', 0)}px`;
  Clone.style.left = `${get(fromTarget, 'left', 0)}px`;
  Clone.style.width = `${get(fromTarget, 'width', 0)}px`;
  Clone.style.height = `${get(fromTarget, 'height', 0)}px`;
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
    translateY: [0, get(toTarget, 'top', 0) - get(fromTarget, 'top', 0)],
    translateX: [0, get(toTarget, 'left', 0) - get(fromTarget, 'left', 0)],
    scaleX: [1, get(toTarget, 'width', 0) / get(fromTarget, 'width', 0)],
    scaleY: [1, get(toTarget, 'height', 0) / get(fromTarget, 'height', 0)],
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
