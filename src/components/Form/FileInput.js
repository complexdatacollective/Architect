import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { uniqueId } from 'lodash';
import cx from 'classnames';
import { actionCreators as assetActions } from '../../ducks/modules/protocol/assets';

class FileInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    importAsset: PropTypes.func.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    children: PropTypes.func,
  };

  static defaultProps = {
    label: '',
    value: '',
    onChange: () => {},
    children: value => value,
  };

  componentWillMount() {
    this.id = uniqueId('label');
  }

  onChange = () => {
    this.props.onChange();
  }

  onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      this.props.importAsset(file);
    });
  }

  render() {
    const {
      value,
      label,
    } = this.props;

    return (
      <label htmlFor={this.id} className={cx('rich-text')}>
        <div className={cx('rich-text__label')}>
          {label}
        </div>
        <div>{this.props.children(value)}</div>
        <Dropzone onDrop={this.onDrop} multiple={false} />,
      </label>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  importAsset: bindActionCreators(assetActions.importAsset, dispatch),
});

export { FileInput };

export default connect(null, mapDispatchToProps)(FileInput);
