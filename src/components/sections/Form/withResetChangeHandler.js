import { connect } from 'react-redux';
import { change } from 'redux-form';
import { toPairs } from 'lodash';
import { withHandlers, compose } from 'recompose';

const mapDispatchToProps = {
  changeField: change,
};

const handlers = {
  resetFields: ({ changeField, form }) =>
    (resetObject) => {
      toPairs(resetObject)
        .forEach(
          ([variableName, value]) =>
            changeField(form, variableName, value),
        );
    },
};

const withResetChangeHandler = compose(
  connect(null, mapDispatchToProps),
  withHandlers(handlers),
);

export { withResetChangeHandler };

export default withResetChangeHandler;
