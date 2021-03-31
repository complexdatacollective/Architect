import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Flipped } from 'react-flip-toolkit';
import { actionCreators as userActions } from '@modules/userActions';
import protocolCover from '@app/images/NC-File.svg';

const getFilename = (path = '') => get(path.match(/([^/\\]+)$/), 1, path);

const ProtocolStack = ({ openNetcanvas, protocol: { filePath } }) => (
  <div
    className="protocol-stack"
    onClick={() => openNetcanvas(filePath)}
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
  // eslint-disable-next-line react/forbid-prop-types
  protocol: PropTypes.object.isRequired,
  openNetcanvas: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  openNetcanvas: userActions.openNetcanvas,
};

export default connect(null, mapDispatchToProps)(ProtocolStack);
