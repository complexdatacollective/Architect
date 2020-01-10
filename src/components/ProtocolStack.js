import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Flipped } from 'react-flip-toolkit';
import { actionCreators as protocolsActions } from '@modules/protocols';
import protocolCover from '@app/images/NC-File.svg';

const getFilename = (path = '') => get(path.match(/([^/\\]+)$/), 1, path);

const ProtocolStack = ({ unbundleAndLoadProtocol, protocol: { filePath } }) => (
  <div
    className="protocol-stack"
    onClick={() => unbundleAndLoadProtocol(filePath)}
  >
    <div className="protocol-stack__preview">
      <Flipped flipId={encodeURIComponent(filePath)}>
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
  unbundleAndLoadProtocol: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  unbundleAndLoadProtocol: bindActionCreators(protocolsActions.unbundleAndLoadProtocol, dispatch),
});

export { ProtocolStack };

export default connect(null, mapDispatchToProps)(ProtocolStack);
