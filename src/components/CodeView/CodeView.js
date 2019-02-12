import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const CodeView = ({ toggleCodeView, code, show }) => (
  <div
    className={cx('code-view', { 'code-view--show': show })}
    onClick={toggleCodeView}
  >
    <pre>
      <code>
        { JSON.stringify(code, null, 2) }
      </code>
    </pre>
  </div>
);

CodeView.propTypes = {
  code: PropTypes.object,
  toggleCodeView: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

CodeView.defaultProps = {
  code: {},
  show: false,
};

export default CodeView;
