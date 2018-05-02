import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Form as ReduxForm, formValueSelector, formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import cx from 'classnames';
import { Button } from '../../ui/components';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';
import { makeGetStage } from '../../selectors/protocol';
import { Guided, Section, Editor } from '../Guided';
import flatten from '../../utils/flatten';
import getSectionsForStageType from './getSectionsForStageType';
import CodeView from './CodeView';

const formName = 'edit-stage';
const getFormValues = formValueSelector(formName);
const form = { name: formName, getValues: getFormValues };

const defaultStage = {
};

const renderSections = (interfaceSections, props) => {
  if (interfaceSections.length === 0) {
    return (
      <Section><Editor>Not yet editable.</Editor></Section>
    );
  }

  return interfaceSections.map(
    (InterfaceSection, index) =>
      <InterfaceSection {...props} key={index} />,
  );
};

const renderSectionsForStageType = ({ stageType, ...rest }) => {
  const interfaceSections = getSectionsForStageType(stageType);
  return renderSections(interfaceSections, { stageType, ...rest });
};

const StageEditor = ({
  stage,
  handleSubmit,
  toggleCodeView,
  codeView,
  dirty,
  invalid,
}) => (
  <ReduxForm onSubmit={handleSubmit} className={cx('stage-editor', { 'stage-editor--show-code': codeView })}>
    <CodeView toggleCodeView={toggleCodeView} form={form} />
    <Guided className="stage-editor__sections">
      <Section className="stage-editor-section">
        <Editor className="stage-editor-section__edit">
          <h1>Edit {stage.type} Screen</h1>
          { dirty && invalid && (
            <p style={{ color: 'var(--error)' }}>
              There are some errors that need to be fixed before this can be saved!
            </p>
          ) }
          <Button size="small" type="button" onClick={toggleCodeView}>Show Code View</Button>
        </Editor>
      </Section>
      {
        renderSectionsForStageType({
          stageType: stage.type,
          form,
        })
      }
    </Guided>
  </ReduxForm>
);

StageEditor.propTypes = {
  stage: PropTypes.object.isRequired,
  stageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  toggleCodeView: PropTypes.func.isRequired,
  codeView: PropTypes.bool.isRequired,
  ...formPropTypes,
};

function makeMapStateToProps() {
  const getStage = makeGetStage();

  return function mapStateToProps(state, props) {
    const stage = getStage(state, props) || defaultStage;
    return { stage, initialValues: stage };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateStage: bindActionCreators(stageActions.updateStage, dispatch),
  };
}

export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  withState('codeView', 'updateCodeView', false),
  withHandlers({
    toggleCodeView: ({ updateCodeView }) => () => updateCodeView(current => !current),
  }),
  reduxForm({
    form: formName,
    touchOnBlur: false,
    touchOnChange: true,
    enableReinitialize: true,
    onSubmit: (values, _, props) => {
      props.updateStage(props.stageId, values);
      props.onComplete();
    },
    onSubmitFail: (errors) => {
      // eslint-disable-next-line no-console
      console.error('FORM ERRORS', flatten(errors));
    },
  }),
)(StageEditor);
