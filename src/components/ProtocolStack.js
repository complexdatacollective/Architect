import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Flipped } from 'react-flip-toolkit';
import protocolCover from '../images/NC-File.svg';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';

const getFilename = (path = '') => get(path.match(/([^/\\]+)$/), 1, path);

const ProtocolStack = ({ importAndLoadProtocol, protocol: { filePath } }) => (
  <div
    className="protocol-stack"
    onClick={() => importAndLoadProtocol(filePath)}
  >
    <div className="protocol-stack__preview">
      <Flipped flipId={filePath}>
        <div className="protocol-stack__stack">
          <div className="protocol-stack__stack-cover">
            <img src={protocolCover} alt="" />
          </div>
        </div>
      </Flipped>
    </div>
    <h4 className="protocol-stack__label">{ getFilename(filePath) }</h4>
    <p className="protocol-stack__filepath" alt={filePath}>{ filePath }</p>
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
