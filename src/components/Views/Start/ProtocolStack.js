import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Tweened from '../../../behaviours/Tweened';
import protocolCover from '../../../images/protocol-cover.png';
import { actionCreators as protocolsActions } from '../../../ducks/modules/protocols';

const Stack = Tweened(() => (
  <div className="start-protocol-stack__stack">
    <div className="start-protocol-stack__stack-cover">
      <img src={protocolCover} alt="" />
    </div>
  </div>
));

const getFilename = (path = '') => get(path.match(/([^/\\]+)$/), 1, path);

const ProtocolStack = ({ importAndLoadProtocol, protocol: { filePath } }) => (
  <div
    component="div"
    className="start-protocol-stack"
    onClick={() => importAndLoadProtocol(filePath)}
  >
    <div className="start-protocol-stack__preview">
      <Stack
        tweenName="protocol"
        tweenElement={filePath}
      />
    </div>
    <div className="start-protocol-stack__label">
      <h3 className="start-protocol-stack__name">{ getFilename(filePath) }</h3>
    </div>
  </div>
);

ProtocolStack.propTypes = {
  protocol: PropTypes.object.isRequired,
  importAndLoadProtocol: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  importAndLoadProtocol: bindActionCreators(protocolsActions.importAndLoadProtocol, dispatch),
});

export { ProtocolStack };

export default connect(null, mapDispatchToProps)(ProtocolStack);
