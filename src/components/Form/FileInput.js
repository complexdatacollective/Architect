import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { uniqueId } from 'lodash';
import cx from 'classnames';
import { fieldPropTypes } from 'redux-form';
import { actionCreators as assetActions } from '../../ducks/modules/protocol/assets';

class FileInput extends PureComponent {
  static propTypes = {
    importAsset: PropTypes.func.isRequired,
    className: PropTypes.string,
    completeClassName: PropTypes.string,
    accept: PropTypes.string,
    children: PropTypes.func,
    ...fieldPropTypes,
  };

  static defaultProps = {
    value: '',
    className: 'file-input',
    completeClassName: 'file-input--complete',
    accept: '',
    children: value => value,
  };

  componentWillMount() {
    this.id = uniqueId('label');
  }

  onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      this.props.importAsset(file)
        .then(({ filename }) => {
          this.props.input.onChange(filename);
        });
    });
  }

  render() {
    const {
      input: { value },
      accept,
      className,
      completeClassName,
    } = this.props;

    return (
      <div className={cx(className, { [completeClassName]: !!value })}>
        { value && this.props.children(value) }
        <Dropzone
          onDrop={this.onDrop}
          multiple={false}
          accept={accept}
          className={cx('input-dropzone', { 'input-dropzone--replace': !!value })}
          activeClassName="input-dropzone--active"
          acceptClassName="input-dropzone--accept"
          rejectClassName="input-dropzone--reject"
          disabledClassName="input-dropzone--disabled"
        />
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  importAsset: bindActionCreators(assetActions.importAsset, dispatch),
});

export { FileInput };

export default connect(null, mapDispatchToProps)(FileInput);
