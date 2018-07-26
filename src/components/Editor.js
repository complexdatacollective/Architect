import React from 'react';
import { reduxForm, Form } from 'redux-form';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import cx from 'classnames';
import { Guided } from './Guided';
import { FormCodeView } from './CodeView';

const Editor = ({
  handleSubmit,
  toggleCodeView,
  showCodeView,
  form,
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
    </Guided>
  </Form>
);

Editor.propTypes = {
  toggleCodeView: PropTypes.func.isRequired,
  showCodeView: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  component: PropTypes.func,
};

Editor.defaultProps = {
  component: null,
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
)(Editor);
