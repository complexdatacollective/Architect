import Tippy from '@tippyjs/react';
import { useRef } from 'react';

const withTooltip =
  (WrappedComponent) =>
  ({ tooltip, tippyProps, ...props }) => {
    const ref = useRef();
    return (
      <>
        <span ref={ref}>
          <WrappedComponent {...props} />
        </span>
        {tooltip && <Tippy content={tooltip} reference={ref} {...tippyProps} />}
      </>
    );
  };

export default withTooltip;
