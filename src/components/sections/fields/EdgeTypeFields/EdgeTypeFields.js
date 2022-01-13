import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import cx from 'classnames';
import Button from '@codaco/ui/lib/components/Button';
import { getFieldId } from '@app/utils/issues';
import EdgeSelect from '@components/Form/Fields/EdgeSelect';
import ValidatedField from '@components/Form/ValidatedField';

class EdgeTypeFields extends Component {
  componentDidUpdate({ typeScreenMessage }) {
    const { handleTypeScreenMessage } = this.props;
    handleTypeScreenMessage(typeScreenMessage);
  }

  render() {
    const {
      edgeTypes,
      disabled,
      handleResetStage,
      handleOpenCreateNewType,
      parse,
      format,
      name,
    } = this.props;

    const nodeTypeClasses = cx(
      'stage-editor-section-node-type',
      { 'stage-editor-section-node-type--disabled': disabled },
    );

    return (
      <div className={nodeTypeClasses}>
        <div id={getFieldId('subject')} data-name="Node type" />
        <div
          className="stage-editor-section-node-type__edit"
          onClick={handleResetStage}
        >
          <div className="stage-editor-section-node-type__edit-capture">
            <ValidatedField
              name={name}
              parse={parse}
              format={format}
              options={edgeTypes}
              component={EdgeSelect}
              validation={{ required: true }}
            />

            { edgeTypes.length === 0
              && (
              <p className="stage-editor-section-node-type__empty">
                No edge types currently defined. Use the button below to create one.
              </p>
              )}

            <Button
              color="primary"
              icon="add"
              size="small"
              onClick={handleOpenCreateNewType}
            >
              Create new edge type
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

EdgeTypeFields.propTypes = {
  edgeTypes: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  handleResetStage: PropTypes.func,
  handleOpenCreateNewType: PropTypes.func.isRequired,
  handleTypeScreenMessage: PropTypes.func.isRequired,
  parse: PropTypes.func.isRequired,
  format: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  typeScreenMessage: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

EdgeTypeFields.defaultProps = {
  edgeTypes: [],
  disabled: false,
  handleResetStage: noop,
  typeScreenMessage: null,
};

export default EdgeTypeFields;
