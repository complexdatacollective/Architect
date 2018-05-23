/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Form, Field, formValueSelector, formPropTypes } from 'redux-form';
import { pick, get, keys } from 'lodash';
import { compose } from 'recompose';
import { Button } from '../../ui/components';
import SeamlessText from '../Form/Fields/SeamlessText';
import { Tweened } from '../../behaviours/Tweened';
import { actionCreators as protocolActions } from '../../ducks/modules/protocol';

const formName = 'protocol-overview';

const Overview = ({
  name,
  version,
  forms,
  variableRegistry,
  externalData,
  updateOptions,
}) => {
  const variables = keys(get(variableRegistry, 'node', {}));

  return (
    <div className="timeline-overview">
      <form>
        <div className="timeline-overview__panel">
          <div className="timeline-overview__content">
            <SeamlessText
              className="timeline-overview__name"
              input={{
                value: name,
                onChange: ({ target: { value }}) => { updateOptions({ name: value }); },
              }}
            />

            <div className="panel__groups">
              <div className="panel__group">
                <h3 className="panel__group-title">Variable registry</h3>
                <p>Node types:</p>
                <ul>
                  { variables.map(nodeType => (<li key={nodeType}>{nodeType}</li>)) }
                </ul>
              </div>
              <div className="panel__group">
                <h3 className="panel__group-title">Forms</h3>
              </div>
              <div className="panel__group">
                <h3 className="panel__group-title">Global Options</h3>

                <p>Version: {version}</p>
              </div>
              <div className="panel__group">
                <h3 className="panel__group-title">Assets</h3>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateOptions: bindActionCreators(protocolActions.updateOptions, dispatch),
});

export default compose(
  connect(null, mapDispatchToProps),
  Tweened({
    tweenName: 'protocol',
    tweenElement: 'overview-panel',
  }),
)(Overview);
