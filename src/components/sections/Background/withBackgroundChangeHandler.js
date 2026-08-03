import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { change, formValueSelector } from 'redux-form';

const withBackgroundChangeHandlerState = connect(
  (state, { form }) => ({
    useImage: !!formValueSelector(form)(state, 'background.image'),
  }),
  { changeForm: change },
);

const withBackgroundChangeHandlerEnabled = withState(
  'useImage',
  'setUseImage',
  ({ useImage }) => !!useImage,
);

const withBackgroundChangeHandlers = withHandlers({
  handleChooseBackgroundType:
    ({ setUseImage, useImage, form, changeForm }) =>
    () => {
      if (useImage) {
        changeForm(form, 'background.image', null);
      } else {
        changeForm(form, 'background.concentricCircles', null);
        changeForm(form, 'background.skewedTowardCenter', null);
      }

      setUseImage(!useImage);
    },
});

const withBackgroundChangeHandler = compose(
  withBackgroundChangeHandlerState,
  withBackgroundChangeHandlerEnabled,
  withBackgroundChangeHandlers,
);

export default withBackgroundChangeHandler;
