import React from 'react';

// Mock components for @codaco/ui
// This is needed because @codaco/ui has ESM resolution issues with relative imports

export const Button = ({ children, ...props }) => (
  <button type="button" {...props}>{children}</button>
);

export const Icon = ({ name, className, ...props }) => (
  <span className={`icon ${className || ''}`} data-icon={name} {...props} />
);

export const GraphicButton = ({ children, ...props }) => (
  <button type="button" {...props}>{children}</button>
);

export const Node = ({ children, ...props }) => (
  <div className="node" {...props}>{children}</div>
);

export const Spinner = () => <div className="spinner" />;

export const ProgressBar = ({ percentProgress }) => (
  <div className="progress-bar" style={{ width: `${percentProgress}%` }} />
);

export const Scroller = ({ children }) => (
  <div className="scroller">{children}</div>
);

export default {
  Button,
  Icon,
  GraphicButton,
  Node,
  Spinner,
  ProgressBar,
  Scroller,
};
