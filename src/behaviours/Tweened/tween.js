/* eslint-disable no-param-reassign */

import { has, get } from 'lodash';
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

const tween = (options, { clone, fromBounds }) => {
  const { name, from, to, before, after, duration } = { ...defaults, ...options };
  const root = document.getElementsByTagName('body')[0];
  const state = store.getState();

  if (!has(state, [name, from]) || !has(state, [name, to])) { return; }

  const toTarget = get(state, [name, to]);

  const toBounds = {
    ...defaultRect,
    ...getAbsoluteBoundingRect(toTarget.node),
  };

  clone.style.position = 'absolute';
  clone.style.zIndex = 'var(--z-fx)';
  clone.style.transform = 'translateZ(0)';
  clone.style.top = `${fromBounds.top}px`;
  clone.style.left = `${fromBounds.left}px`;
  clone.style.width = `${fromBounds.width}px`;
  clone.style.height = `${fromBounds.height}px`;
  clone.style.transformOrigin = 'top left';
  clone.classList.add(`tween-${name}`);

  root.appendChild(clone);

  // Force repaint
  clone.scrollTop; // eslint-disable-line

  clone.classList.add(`tween-${name}-before`);

  setTimeout(() => {
    clone.classList.add(`tween-${name}-active`);
  }, before);

  setTimeout(() => {
    clone.classList.add(`tween-${name}-after`);
  }, (before + duration));

  const beforeAnimation = {
    targets: clone,
    elasticity: 0,
    easing: [0.25, 0.1, 0.25, 1],
    duration: before,
  };

  const activeAnimation = {
    targets: clone,
    elasticity: 0,
    easing: [0.25, 0.1, 0.25, 1],
    duration,
    translateY: [0, toBounds.top - fromBounds.top],
    translateX: [0, toBounds.left - fromBounds.left],
    scaleX: [1, toBounds.width / fromBounds.width],
    scaleY: [1, toBounds.height / fromBounds.height],
  };

  const afterAnimation = {
    targets: clone,
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
      root.removeChild(clone);
    });
};

const captureStartAndDefer = (options) => {
  const { name, from } = options;
  const state = store.getState();

  if (!has(state, [name, from])) { return; }

  const fromTarget = get(state, [name, from]);

  const fromBounds = {
    ...defaultRect,
    ...fromTarget.bounds,
  };

  const clone = fromTarget.node.cloneNode(true);

  tween(options, { clone, fromBounds });
};


export default captureStartAndDefer;
