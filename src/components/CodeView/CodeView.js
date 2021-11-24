import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { motion } from 'framer-motion';
import { getFormValues } from 'redux-form';
import { getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';

const variants = {
  hide: { opacity: 0, translateY: '-100%' },
  show: { opacity: 1, translateY: '0%' },
};

const CodeView = ({ toggleCodeView, show, form }) => {
  const code = useSelector(getFormValues(form));
  const transition = useMemo(() => ({
    ease: 'easeInOut',
    duration: getCSSVariableAsNumber('--animation-duration-standard-ms') / 1000,
  }), []);

  return (
    <motion.div
      className={cx('code-view', { 'code-view--show': show })}
      variants={variants}
      initial="hide"
      animate={show ? 'show' : 'hide'}
      transition={transition}
    >
      <div className="code-view__content">
        <pre>
          <code>
            { show && JSON.stringify(code, null, 2) }
          </code>
        </pre>
      </div>
      <div className="code-view__controls" onClick={toggleCodeView}>Close code view</div>
    </motion.div>
  );
};

CodeView.propTypes = {
  form: PropTypes.string.isRequired,
  toggleCodeView: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

CodeView.defaultProps = {
  show: false,
};

export default CodeView;
