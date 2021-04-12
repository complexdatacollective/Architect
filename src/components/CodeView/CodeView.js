import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { motion } from 'framer-motion';
import { getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';

const transition = () => ({
  ease: 'easeInOut',
  duration: getCSSVariableAsNumber('--animation-duration-standard-ms') / 1000,
});

const variants = {
  hide: { opacity: 0, translateY: '-100%' },
  show: { opacity: 1, translateY: '0%' },
};

const CodeView = ({ toggleCodeView, code, show }) => (
  <motion.div
    className={cx('code-view', { 'code-view--show': show })}
    variants={variants}
    initial="hide"
    animate={show ? 'show' : 'hide'}
    transition={transition()}
  >
    <div className="code-view__content">
      <pre>
        <code>
          { JSON.stringify(code, null, 2) }
        </code>
      </pre>
    </div>
    <div className="code-view__controls" onClick={toggleCodeView}>Close code view</div>
  </motion.div>
);

CodeView.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  code: PropTypes.object,
  toggleCodeView: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

CodeView.defaultProps = {
  code: {},
  show: false,
};

export default CodeView;
