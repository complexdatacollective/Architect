import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { change } from 'redux-form';

import { getEdgesForSubject } from '../SociogramPrompts/selectors';

const mapDispatchToProps = {
  changeForm: change,
};

const mapStateToProps = (state) => {
  const edgesForSubject = getEdgesForSubject(state);

  return {
    edgesForSubject,
  };
};

const handlers = withHandlers({
  // createEdge select has changed value, so we must reset rest
  // of the dependent fields.
  handleChangeCreateEdge:
    ({ changeForm, form }) =>
    (value) => {
      if (!value) return;
      changeForm(form, 'createEdge', value);
    },
});

const withEdgesOptions = compose(
  connect(mapStateToProps, mapDispatchToProps),
  handlers,
);

export default withEdgesOptions;
