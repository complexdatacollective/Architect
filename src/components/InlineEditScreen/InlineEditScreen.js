import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { Flipped } from 'react-flip-toolkit';
import Fade from '@codaco/ui/lib/components/Transitions/Fade';
import window from '@codaco/ui/lib/components/window';
import { compose } from 'recompose';
import Button from '@codaco/ui/lib/components/Button';
import Layout, { Section } from '@components/EditorLayout';
import Form from './Form';

const InlineEditScreen = ({
  show,
  form,
  submitForm,
  title,
  flipId,
  onSubmit,
  onCancel,
  children,
  ...rest
}) => {
  const handleSubmit = useCallback(() => {
    submitForm(form);
  }, [form, submitForm]);

  return (
    <Fade in={show}>
      <div className="inline-edit-screen" onClick={e => e.stopPropagation()}>
        <Flipped flipId={flipId}>
          <div className="inline-edit-screen__container">
            <div className="inline-edit-screen__content">
              <Layout>
                { title &&
                  <Section>
                    <h1>{title}</h1>
                  </Section>
                }
                <Form form={form} onSubmit={onSubmit} {...rest}>
                  {children}
                </Form>
              </Layout>
            </div>
            <div className="inline-edit-screen__controls">
              <Button onClick={handleSubmit} type="submit">Save and continue</Button>
              <Button onClick={onCancel} color="platinum">Cancel</Button>
            </div>
          </div>
        </Flipped>
      </div>
    </Fade>
  );
};

InlineEditScreen.propTypes = {
  show: PropTypes.bool,
  form: PropTypes.string.isRequired,
  flipId: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  children: PropTypes.node,
};

InlineEditScreen.defaultProps = {
  title: null,
  show: false,
  flipId: null,
  children: null,
};

const mapDispatchToProps = {
  submitForm: submit,
};

export default compose(
  window,
  connect(null, mapDispatchToProps),
)(InlineEditScreen);

