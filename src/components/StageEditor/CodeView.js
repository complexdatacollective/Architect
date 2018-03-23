import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

const CodeView = ({ toggleCodeView, stage }) => (
  <div className="stage-editor__code" onClick={toggleCodeView}>
    <pre>
      <code>
        { JSON.stringify(stage, null, 2) }
      </code>
    </pre>
  </div>
);

CodeView.propTypes = {
  stage: PropTypes.object,
  toggleCodeView: PropTypes.func.isRequired,
};

CodeView.defaultProps = {
  stage: {},
};

const mapStateToProps = state => ({
  stage: getFormValues('edit-stage')(state),
});

export default connect(mapStateToProps)(CodeView);
