import { has, get, reduce } from 'lodash';
import anime from 'animejs';

window.Tweens = window.Tweens || [];

const tween = ({ name, uuid, before, after, duration }) => {
  const root = document.getElementsByTagName('body')[0];

  if (!has(window.Tweens, name)) { return; }

  const from = get(window.Tweens, [name, uuid]);
  const to = reduce(
    get(window.Tweens, name),
    (memo, value, key) => {
      if (key === uuid) return memo;
      return { ...memo, ...value };
    },
    {},
  );

  const Clone = from.node.cloneNode(true);

  Clone.style.position = 'absolute';
  Clone.style.transform = 'translateZ(0)';
  Clone.style.top = `${get(from, 'top', 0)}px`;
  Clone.style.left = `${get(from, 'left', 0)}px`;
  Clone.style.width = `${get(from, 'width', 0)}px`;
  Clone.style.height = `${get(from, 'height', 0)}px`;
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
    translateY: [0, get(to, 'top', 0) - get(from, 'top', 0)],
    translateX: [0, get(to, 'left', 0) - get(from, 'left', 0)],
    scaleX: [1, get(to, 'width', 0) / get(from, 'width', 0)],
    scaleY: [1, get(to, 'height', 0) / get(from, 'height', 0)],
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

export default tween;
