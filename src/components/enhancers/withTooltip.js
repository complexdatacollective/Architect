/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef } from 'react';
import Tippy from '@tippyjs/react';

const withTooltip = (WrappedComponent) => ({ tooltip, tippyProps, ...props }) => {
  const ref = useRef();
  return (
    <>
      <span ref={ref}>
        <WrappedComponent {...props} />
      </span>
      {tooltip && (
        <Tippy
          content={tooltip}
          reference={ref}
          {...tippyProps}
        />
      )}
    </>
  );
};

export default withTooltip;
