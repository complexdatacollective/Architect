/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Form as ReduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { compose, withState, withHandlers } from 'recompose';
import cx from 'classnames';
import { actionCreators as stageActions } from '../../ducks/modules/protocol/stages';
import { makeGetStage } from '../../selectors/protocol';
import { Guided, Section, Editor } from '../Guided';
import {
  Title,
  ContentItems,
  NodeType,
  Form,
  NameGeneratorPrompts,
  Panels,
} from './sections';
import CodeView from './CodeView';

const defaultStage = {
};

const interfaces = {
  Information: [
    Title,
    ContentItems,
  ],
  NameGenerator: [
    Title,
    NodeType,
    Form,
    NameGeneratorPrompts,
    // Panels,
  ],
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

const renderInterfaceSections = (props) => {
  const stageType = props.stage.type;
  const interfaceSections = get(interfaces, stageType, []);
  return renderSections(interfaceSections, props);
};

const StageEditor = (props) => {
  const { stage: { type }, handleSubmit, toggleCodeView, codeView, showCodeView, hideCodeView, ...rest } = props;

  return (
    <ReduxForm onSubmit={handleSubmit} className={cx('stage-editor', { 'stage-editor--show-code': codeView })}>
      <CodeView toggleCodeView={toggleCodeView} />
      <Guided className="stage-editor__sections">
        <Section className="stage-editor-section">
          <Editor className="stage-editor-section__edit">
            <h1>Edit {type} Screen</h1>
            <button type="button" onClick={toggleCodeView}>Show Code View</button>
          </Editor>
        </Section>
        { renderInterfaceSections({ stage: { ...props.stage }, ...rest }) }
      </Guided>
    </ReduxForm>
  );
};

StageEditor.propTypes = {
  stage: PropTypes.object.isRequired,
  toggleCodeView: PropTypes.func.isRequired,
  codeView: PropTypes.bool.isRequired,
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
  withState('codeView', 'toggleCodeView', false),
  withHandlers({
    showCodeView: ({ toggleCodeView }) => () => toggleCodeView(true),
    hideCodeView: ({ toggleCodeView }) => () => toggleCodeView(false),
    toggleCodeView: ({ toggleCodeView }) => () => toggleCodeView(current => !current),
  }),
  reduxForm({
    form: 'edit-stage',
    touchOnBlur: false,
    touchOnChange: true,
    enableReinitialize: true,
    onSubmit: (values, _, props) => {
      console.log(values)
      props.updateStage(props.stageId, values);
      props.onComplete();
    },
    onSubmitFail: () => {
      alert('FAIL!!');
    },
    onSubmitSuccess: () => {
      alert('SUCCESS!!');
    },
  }),
)(StageEditor);
