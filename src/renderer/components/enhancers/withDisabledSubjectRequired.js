import { withProps } from 'recompose';

const withDisabledSubjectRequired = withProps(({ interfaceType, type }) => {
  if (interfaceType === 'EgoForm') { return { disabled: false }; }

  return { disabled: !type };
});

export default withDisabledSubjectRequired;
