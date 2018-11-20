import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { arrayPush } from 'redux-form';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import cx from 'classnames';
import Guidance from '../../../Guidance';
import NameGeneratorPrompt from './NameGeneratorListPrompt';
import OrderedList, { NewButton } from '../../../OrderedList';
import ValidatedFieldArray from '../../../Form/ValidatedFieldArray';
import { getFieldId } from '../../../../utils/issues';
import { getExternalDataSources } from '../../../../selectors/protocol';

const fieldName = 'prompts';

const notEmpty = value => (
  value && value.length > 0 ? undefined : 'You must create at least one prompt'
);

class NameGeneratorPromptsSection extends PureComponent {
  render() {
    const {
      nodeType,
      dataSources,
      form,
      disabled,
      addNewPrompt,
    } = this.props;

    return (
      <Guidance contentId="guidance.editor.name_generator_prompts">
        <div className={cx('stage-editor-section', { 'stage-editor-section--disabled': disabled })}>
          <div id={getFieldId(`${fieldName}._error`)} data-name="Prompts" />
          <h2>Prompts</h2>
          <p>
            Add one or more &quot;prompts&quot; below, to ecourage your participants to create
            nodes.
          </p>
          <div className="stage-editor-section-prompts">
            <div className="stage-editor-section-prompts__prompts">
              { nodeType &&
                <ValidatedFieldArray
                  name={fieldName}
                  component={OrderedList}
                  item={NameGeneratorPrompt}
                  nodeType={nodeType}
                  dataSources={dataSources}
                  form={form}
                  validation={{ notEmpty }}
                />
              }
            </div>
            <NewButton onClick={addNewPrompt} />
          </div>
        </div>
      </Guidance>
    );
  }
}

NameGeneratorPromptsSection.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  disabled: PropTypes.bool,
  addNewPrompt: PropTypes.func.isRequired,
  nodeType: PropTypes.string,
  dataSources: PropTypes.array,
};

NameGeneratorPromptsSection.defaultProps = {
  disabled: false,
  nodeType: null,
  dataSources: [],
};

const mapStateToProps = (state, props) => {
  const nodeType = get(props.form.getValues(state, 'subject'), 'type');
  const dataSources = getExternalDataSources(state)
    .map(source => ({ value: source, label: source }));

  return {
    disabled: !nodeType,
    nodeType,
    dataSources,
  };
};

const mapDispatchToProps = (dispatch, { form: { name } }) => ({
  addNewPrompt: bindActionCreators(
    () => arrayPush(name, fieldName, { id: uuid() }),
    dispatch,
  ),
});

export { NameGeneratorPromptsSection };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(NameGeneratorPromptsSection);
