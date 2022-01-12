import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion/dist/framer-motion';
import { getFormValues } from 'redux-form';

const variants = {
  hide: { translateY: '-100%' },
  show: { translateY: '0%' },
};

const CodeView = ({ toggleCodeView, show, form }) => {
  const code = useSelector(getFormValues(form));

  console.log('code', show, code);

  return (
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
