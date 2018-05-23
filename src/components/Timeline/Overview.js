import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { get, keys } from 'lodash';
import { compose } from 'recompose';
import SeamlessText from '../Form/Fields/SeamlessText';
import { Tweened } from '../../behaviours/Tweened';
import { actionCreators as protocolActions } from '../../ducks/modules/protocol';

const Overview = ({
  name,
  version,
  variableRegistry,
  updateOptions,
}) => {
  const nodeTypes = keys(get(variableRegistry, 'node', {}));
  const edgeTypes = keys(get(variableRegistry, 'edge', {}));

  return (
    <div className="timeline-overview">
      <form>
        <div className="timeline-overview__panel">
          <div className="timeline-overview__content">
            <SeamlessText
              className="timeline-overview__name"
              input={{
                value: name,
                onChange: ({ target: { value } }) => { updateOptions({ name: value }); },
              }}
            />

            <div className="panel__groups">
              <div className="panel__group">
                <h3 className="panel__group-title">Variable registry</h3>
                <h4>Node types</h4>
                <ul>
                  { nodeTypes.map(nodeType => (<li key={nodeType}>{nodeType}</li>)) }
                </ul>
                <h4>Edge types</h4>
                <ul>
                  { edgeTypes.map(edgeType => (<li key={edgeType}>{edgeType}</li>)) }
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

Overview.propTypes = {
  name: PropTypes.string,
  version: PropTypes.string,
  forms: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  variableRegistry: PropTypes.object,
  externalData: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  updateOptions: PropTypes.func,
};

Overview.defaultProps = {
  name: '',
  version: '',
  forms: {},
  variableRegistry: {},
  externalData: {},
  updateOptions: () => {},
};

const mapDispatchToProps = dispatch => ({
  updateOptions: bindActionCreators(protocolActions.updateOptions, dispatch),
});

export default compose(
  connect(null, mapDispatchToProps),
  Tweened({
    tweenName: 'protocol',
    tweenElement: 'overview-panel',
  }),
)(Overview);
