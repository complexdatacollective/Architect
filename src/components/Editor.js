import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form, getFormSyncErrors, hasSubmitFailed } from 'redux-form';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import cx from 'classnames';
import { Guided } from './Guided';
import { FormCodeView } from './CodeView';
import Issues from './Issues';

const Editor = ({
  handleSubmit,
  toggleCodeView,
  showCodeView,
  form,
  issues,
  submitFailed,
  component: Component,
  ...rest
}) => (
  <Form
    onSubmit={handleSubmit}
    className={cx('editor', { 'editor--show-code': showCodeView })}
  >
    <FormCodeView toggleCodeView={toggleCodeView} form={form} />
    <Guided form={form}>
      <Component form={form} toggleCodeView={toggleCodeView} {...rest} />

      <Issues issues={issues} show={submitFailed} />
    </Guided>
  </Form>
);

Editor.propTypes = {
  toggleCodeView: PropTypes.func.isRequired,
  showCodeView: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  issues: PropTypes.array.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  form: PropTypes.string.isRequired,
  component: PropTypes.func,
};

Editor.defaultProps = {
  component: null,
};

const mapStateToProps = (state, props) => {
  const issues = getFormSyncErrors(props.form)(state);
  return {
    issues,
    hasSubmitFailed: hasSubmitFailed(props.form)(state),
  };
};

export { Editor };

export default compose(
  withState('showCodeView', 'updateCodeView', false),
  withHandlers({
    toggleCodeView: ({ updateCodeView }) => () => updateCodeView(current => !current),
  }),
  reduxForm({
    touchOnBlur: false,
    touchOnChange: true,
    enableReinitialize: true,
  }),
  connect(mapStateToProps),
)(Editor);
