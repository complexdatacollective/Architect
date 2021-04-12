import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import { withHandlers, compose } from 'recompose';
import { getEdgesForSubject } from './selectors';

const mapDispatchToProps = {
  changeForm: change,
};

const mapStateToProps = (state, { entity, type, form }) => {
  const allowHighlighting = formValueSelector(form)(state, 'highlight.allowHighlighting');
  const edgesForSubject = getEdgesForSubject(state, { entity, type });
  const displayEdges = formValueSelector(form)(state, 'edges.display') || [];
  const createEdges = formValueSelector(form)(state, 'edges.create');
  const displayEdgesOptions = edgesForSubject.map((edge) => {
    if (edge.value !== createEdges) { return edge; }
    return {
      ...edge,
      disabled: true,
    };
  });

  return {
    edgesForSubject,
    allowHighlighting,
    displayEdges,
    displayEdgesOptions,
  };
};

const handlers = withHandlers({
  handleChangeCreateEdge: ({ changeForm, form, displayEdges }) => (value) => {
    if (!value) return;

    const newDisplayEdges = [
      ...displayEdges,
      value,
    ];

    changeForm(form, 'edges.display', newDisplayEdges);
  },
});

const withEdgesOptions = compose(
  connect(mapStateToProps, mapDispatchToProps),
  handlers,
);

export default withEdgesOptions;
