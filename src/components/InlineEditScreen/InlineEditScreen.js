import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { AnimatePresence, motion } from 'framer-motion';
import window from '@codaco/ui/lib/components/window';
import { compose } from 'recompose';
import Button from '@codaco/ui/lib/components/Button';
import { Layout } from '@components/EditorLayout';
import Form from './Form';

const screenVariants = {
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      when: 'beforeChildren',
    },
  },
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
};

const item = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const InlineEditScreen = ({
  show,
  form,
  submitForm,
  title,
  layoutId,
  onSubmit,
  onCancel,
  children,
  ...rest
}) => {
  const handleSubmit = useCallback(() => {
    submitForm(form);
  }, [form, submitForm]);

  return (
    <AnimatePresence>
      { show && (
        <div className="inline-edit-screen" onClick={(e) => e.stopPropagation()}>
          <motion.div
            className="inline-edit-screen__container"
            variants={screenVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div variants={item} className="inline-edit-screen__header">
              <h2>{title}</h2>
            </motion.div>
            <motion.div variants={item} className="inline-edit-screen__content">
              <Layout>
                <Form
                  form={form}
                  onSubmit={onSubmit}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...rest}
                >
                  {children}
                </Form>
              </Layout>
            </motion.div>
            <motion.div variants={item} className="inline-edit-screen__controls">
              <Button onClick={onCancel} color="platinum">Cancel</Button>
              <Button onClick={handleSubmit} type="submit" icon="arrow-right" iconPosition="right">Save and Close</Button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

InlineEditScreen.propTypes = {
  children: PropTypes.node,
  form: PropTypes.string.isRequired,
  layoutId: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  show: PropTypes.bool,
  submitForm: PropTypes.func.isRequired,
  title: PropTypes.string,
};

InlineEditScreen.defaultProps = {
  children: null,
  layoutId: null,
  show: false,
  title: null,
};

const mapDispatchToProps = {
  submitForm: submit,
};

export default compose(
  window,
  connect(null, mapDispatchToProps),
)(InlineEditScreen);
