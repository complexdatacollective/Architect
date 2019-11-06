import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Flipped } from 'react-flip-toolkit';
import protocolCover from '../images/NC-File.svg';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';

const getFilename = (path = '') => get(path.match(/([^/\\]+)$/), 1, path);

const ProtocolStack = ({ unbundleAndLoad, protocol: { filePath } }) => (
  <div
    className="protocol-stack"
    onClick={() => unbundleAndLoad(filePath)}
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
  unbundleAndLoad: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  unbundleAndLoad: protocolsActions.unbundleAndLoad,
};

export { ProtocolStack };

export default connect(null, mapDispatchToProps)(ProtocolStack);
