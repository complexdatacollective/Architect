import { connect } from 'react-redux';
import { change } from 'redux-form';
import { withHandlers, compose } from 'recompose';
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
  handleChangeCreateEdge: ({ changeForm, form }) => (value) => {
    if (!value) return;

    changeForm(form, 'createEdge', value);
  },
});

const withEdgesOptions = compose(
  connect(mapStateToProps, mapDispatchToProps),
  handlers,
);

export default withEdgesOptions;
