import React, { Component } from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import cx from 'classnames';
import Button from '@codaco/ui/lib/components/Button';
import NetworkFilter from '@components/sections/NetworkFilter';
import { getFieldId } from '@app/utils/issues';
import EdgeSelect from '@components/Form/Fields/EdgeSelect';
import ValidatedField from '@components/Form/ValidatedField';
import Section from '@components/sections/Section';
import Row from '@components/sections/Row';
import withDisableAndReset from './withDisableAndReset';
import withCreateNewType from './withCreateEdgeType';
import withEdgeTypeOptions from './withEdgeTypeOptions';

class EdgeType extends Component {
  static propTypes = {
    edgeTypes: PropTypes.arrayOf(PropTypes.object),
    disabled: PropTypes.bool,
    handleResetStage: PropTypes.func.isRequired,
    handleOpenCreateNewType: PropTypes.func.isRequired,
    handleTypeScreenMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    edgeTypes: [],
    disabled: false,
    displayVariable: null,
  };

  componentDidUpdate({ typeScreenMessage }) {
    this.props.handleTypeScreenMessage(typeScreenMessage);
  }

  render() {
    const {
      edgeTypes,
      disabled,
      handleResetStage,
      handleOpenCreateNewType,
    } = this.props;

    const nodeTypeClasses = cx('stage-editor-section', 'stage-editor-section-node-type', { 'stage-editor-section-node-type--disabled': disabled });

    return (
      <Section className={nodeTypeClasses} contentId="guidance.editor.node_type">
        <Row>
          <div id={getFieldId('subject')} data-name="Node type" />
          <h2>Edge Type</h2>
          <p>Which edge type is used on this interface?</p>
          <div
            className="stage-editor-section-node-type__edit"
            onClick={handleResetStage}
          >
            <div className="stage-editor-section-node-type__edit-capture">
              <ValidatedField
                name="subject"
                parse={value => ({ type: value, entity: 'edge' })}
                format={value => get(value, 'type')}
                options={edgeTypes}
                component={EdgeSelect}
                validation={{ required: true }}
              />

              { edgeTypes.length === 0 &&
                <p className="stage-editor-section-node-type__empty">
                  No edge types currently defined. Use the button below to create one.
                </p>
              }

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
        </Row>
        <NetworkFilter />
      </Section>
    );
  }
}

export { EdgeType };

export default compose(
  withEdgeTypeOptions,
  withDisableAndReset,
  withCreateNewType,
)(EdgeType);
