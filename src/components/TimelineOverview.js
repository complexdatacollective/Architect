import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ToggleInput } from 'network-canvas-ui';
import { getProtocol } from '../selectors/protocol';
import { actionCreators as protocolActions } from '../ducks/modules/protocolOptions';
import TextInput from './TextInput';
import SeamlessInput from './SeamlessInput';

class TimelineOverview extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        protocol_location: 'http://northwestern.edu/my-study',
      },
    };
  }

  onOptionChange = (option, value) => {
    this.setState({
      options: {
        ...this.state.options,
        [option]: value,
      },
    });
  }

  onChangeTitle = (title) => {
    this.props.updateOptions({ title });
  }

  render() {
    const { title } = this.props;
    const { options } = this.state;

    return (
      <div className="timeline-overview">
        <div className="panel">
          <div className="panel__title">
            <SeamlessInput className="timeline-overview__title" value={title} onChange={this.onChangeTitle} />
          </div>

          <div className="panel__groups">
            <div className="panel__group" style={{ gridRow: 1, gridColumn: 1 }}>
              <h2 className="panel__group-title">Variable registry</h2>
              <div className="timeline-overview__variables">
                <div className="timeline-overview__variables-nodes">
                  <div className="timeline-overview__variables-node">Person</div>
                  <div className="timeline-overview__variables-node">Place</div>
                </div>
                <div className="timeline-overview__variables-edges">
                  <div className="timeline-overview__variables-edge">Friendship</div>
                  <div className="timeline-overview__variables-edge">Family</div>
                </div>
              </div>
            </div>

            <div className="panel__group" style={{ gridRow: 2, gridColumn: 1 }}>
              <h2 className="panel__group-title">Deployment</h2>
              <div>
                <TextInput
                  label="Protocol location"
                  onChange={(value) => { this.onOptionChange('protocol_location', value); }}
                  value={this.state.options.protocol_location}
                />
                <img
                  style={{ margin: '0 auto', width: '100px', height: '100px', border: '1px solid grey', display: 'block' }}
                  src=""
                  alt="QR code here"
                />
              </div>
            </div>

            <div className="panel__group" style={{ gridRow: '1 / 3', gridColumn: 2 }}>
              <h2 className="panel__group-title">Global options</h2>
              <div>
                <ToggleInput
                  checked={options.allowExport}
                  onCheck={(_, value) => { this.onOptionChange('allowExport', value); }}
                  label="Allow in-app data export"
                />
                <ToggleInput
                  checked={options.anonymizeDataExport}
                  onCheck={(_, value) => { this.onOptionChange('anonymizeDataExport', value); }}
                  label="Anonymize data before export"
                />
                <ToggleInput
                  checked={options.autoCaseNumber}
                  onCheck={(_, value) => { this.onOptionChange('autoCaseNumber', value); }}
                  label="Automatically generate case number"
                />
                <ToggleInput
                  checked={options.allowRemoteUpload}
                  onCheck={(_, value) => { this.onOptionChange('allowRemoteUpload', value); }}
                  label="Allow remote data upload"
                />
                <ToggleInput
                  checked={options.requirePin}
                  onCheck={(_, value) => { this.onOptionChange('requirePin', value); }}
                  label="Require PIN to export data"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TimelineOverview.propTypes = {
  title: PropTypes.string.isRequired,
  updateOptions: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const protocol = getProtocol(state);

  return {
    title: protocol.options.title,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateOptions: bindActionCreators(protocolActions.updateOptions, dispatch),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(TimelineOverview);
