import { withProps } from 'recompose';

const withDisabledFormTitle = withProps(({ interfaceType }) => {
  if (
    interfaceType === 'EgoForm'
    || interfaceType === 'AlterForm'
    || interfaceType === 'AlterEdgeForm'
  ) {
    return { disableFormTitle: true };
  }

  return { disableFormTitle: false };
});

export default withDisabledFormTitle;
