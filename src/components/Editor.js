import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form, getFormSyncErrors, hasSubmitFailed } from 'redux-form';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import { FormCodeView } from './CodeView';
import Issues from './Issues';

/**
 * Editor is a scaffold for specific editor components.
 *
 * It includes:
 * - `<Issues />` component, which provides interactive form errors
 * - `<FormCodeView />` component, which reveals the form's working copy of the configuration
 * - A redux-form `<Form />` component, which allows us to dispatch submit from outside
 *   the editor (necessary for our button footers).
 *
 * Required props:
 * - {string} form Name to use for the form in redux-form, this must match any child form
 *   components which hard-code this values
 * - {Component} component A React component which contains any number of redux-form `<Field />`
 * - {func} onSubmit(values) The submit handler, it receives the values of the form as an argument
 *   and will likely be hooked up to redux state.
 * - It also accepts the same props as `reduxForm()`, such as `initialValues`
 *
 * @example
 * export const formName = 'MY_EDITOR';
 *
 * const MySpecificEditor = ({
 *   submitHandler,
 * }) => (
 *   <Editor
 *     form={formName}
 *     component={MyFieldsComponent}
 *     onSubmit={submitHandler}
 *   />
 * );
 *
 * const mapDispatchToProps = (dispatch) => ({
 *   onSubmit: (values) => {
 *     if (values.id) {
 *       dispatch(actions.update(values.id, values));
 *     } else {
 *       dispatch(actions.create(values));
 *     }
 *   },
 * });
 *
 * export default connect(null, mapDispatchToProps)(MySpecificEditor);
 */
const Editor = ({
  handleSubmit,
  toggleCodeView,
  showCodeView,
  form,
  children,
  issues,
  title,
  submitFailed,
  component: Component,
  ...rest
}) => (
  <React.Fragment>
    <FormCodeView toggleCodeView={toggleCodeView} form={form} show={showCodeView} />
    <Form onSubmit={handleSubmit}>
      { typeof children === 'function' &&
        children({ form, toggleCodeView, ...rest })
      }
      { children && typeof children !== 'function' && children }
      { !children &&
        <Component form={form} {...rest} />
      }
    </Form>
    <Issues
      issues={issues}
      show={submitFailed}
    />
  </React.Fragment>
);

Editor.propTypes = {
  toggleCodeView: PropTypes.func.isRequired,
  showCodeView: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  issues: PropTypes.object.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  form: PropTypes.string.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  component: PropTypes.func,
};

Editor.defaultProps = {
  component: null,
  children: null,
  title: '',
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
