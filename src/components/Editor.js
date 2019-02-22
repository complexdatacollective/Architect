import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form, getFormSyncErrors, hasSubmitFailed } from 'redux-form';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import { Guided } from './Guided';
import { FormCodeView } from './CodeView';
import Issues from './Issues';
import windowRootProvider from '../ui/components/windowRootProvider';

const Editor = ({
  handleSubmit,
  toggleCodeView,
  showCodeView,
  form,
  issues,
  submitFailed,
  component: Component,
  setWindowRoot,
  ...rest
}) => (
  <React.Fragment>
    <FormCodeView toggleCodeView={toggleCodeView} form={form} show={showCodeView} />
    <Guided form={form}>
      <div className="editor" ref={setWindowRoot}>
        <div className="editor__window">
          <div className="editor__content">
            <Form onSubmit={handleSubmit}>
              <Component form={form} toggleCodeView={toggleCodeView} {...rest} />
            </Form>
          </div>
          <Issues
            issues={issues}
            show={submitFailed}
          />
        </div>
      </div>
    </Guided>
  </React.Fragment>
);

Editor.propTypes = {
  toggleCodeView: PropTypes.func.isRequired,
  showCodeView: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  issues: PropTypes.object.isRequired,
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
  windowRootProvider,
)(Editor);
