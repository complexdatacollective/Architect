import React from 'react';
import { reduxForm, Form } from 'redux-form';
import PropTypes from 'prop-types';
import { compose, withStateHandlers } from 'recompose';
import Issues from './Issues';

/**
 * Editor is a scaffold for specific editor components.
 *
 * It includes:
 * - `<Issues />` component, which provides interactive form errors
 * - `<CodeView />` component, which reveals the form's working copy of the configuration
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
  hideIssues,
  isIssuesVisible,
  form,
  children,
  title,
  submitFailed,
  component: Component,
  ...rest
}) => (
  <>
    <Form onSubmit={handleSubmit}>
      { typeof children === 'function'
        && children({
          form, submitFailed, ...rest,
        })}
      { children && typeof children !== 'function' && children }
      { !children && (
        <Component
          form={form}
          submitFailed={submitFailed}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
        />
      )}
    </Form>
    <Issues
      form={form}
      show={isIssuesVisible}
      hideIssues={hideIssues}
    />
  </>
);

Editor.propTypes = {
  hideIssues: PropTypes.func.isRequired,
  isIssuesVisible: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitFailed: PropTypes.bool.isRequired,
  form: PropTypes.string.isRequired,
  title: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  component: PropTypes.func,
};

Editor.defaultProps = {
  component: null,
  children: null,
  title: '',
};

export default compose(
  withStateHandlers(
    { isIssuesVisible: false },
    {
      hideIssues: () => () => ({ isIssuesVisible: false }),
      onSubmitFail: () => () => ({ isIssuesVisible: true }),
    },
  ),
  reduxForm({
    touchOnBlur: false,
    touchOnChange: true,
    enableReinitialize: true,
  }),
)(Editor);
