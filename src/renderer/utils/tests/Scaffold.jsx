/* eslint-env jest */

import React from 'react';
import PropTypes from 'prop-types';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reduxForm } from 'redux-form';
import { compose } from 'recompose';

const store = createStore(() => ({}));

const Form = compose(
  reduxForm({
    form: 'foo',
  }),
)(
  (({ children }) => (
    <form>
      {children}
    </form>
  )),
);

const Scaffold = (({ children }) => (
  <Provider store={store}>
    <Form>
      {children}
    </Form>
  </Provider>
));

Scaffold.propTypes = {
  children: PropTypes.node,
};

Scaffold.defaultProps = {
  children: null,
};

export default Scaffold;
