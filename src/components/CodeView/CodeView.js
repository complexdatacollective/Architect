import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getFormValues } from 'redux-form';
import { createPortal } from 'react-dom';

const variants = {
  hide: { translateY: '-100%', transition: { stiffness: 1000 } },
  show: { translateY: '0%' },
};

const CodeView = ({ toggleCodeView, show, form }) => {
  const code = useSelector(getFormValues(form));

  return createPortal(
    <motion.div
      className="code-view"
      variants={variants}
      initial="hide"
      animate={show ? 'show' : 'hide'}
    >
      <div className="code-view__content">
        <pre>
          <code>
            { show && JSON.stringify(code, null, 2) }
          </code>
        </pre>
      </div>
      <div className="code-view__controls" onClick={toggleCodeView}>Close code view</div>
    </motion.div>,
    document.body,
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
