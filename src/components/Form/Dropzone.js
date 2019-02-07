import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactDropzone from 'react-dropzone';
import cx from 'classnames';

const Dropzone = ({
  accept,
  value,
  onDrop,
  onBrowseLibrary,
  children,
}) => {
  const browseLibraryMessage = (
    <Fragment>
      , or&nbsp;<div className="form-dropzone__link" onClick={onBrowseLibrary}>browse library</div>
    </Fragment>
  );

  const dropMessage = (
    <Fragment>
      Drop file here,&nbsp;
      <div className="form-dropzone__link">browse files</div>
      { onBrowseLibrary && browseLibraryMessage }
    </Fragment>
  );

  return (
    <ReactDropzone
      onDrop={onDrop}
      multiple={false}
      accept={accept}
    >
      {
        ({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragAccept,
          isDragReject,
          isDragDisabled,
        }) => (
          <div
            {...getRootProps()}
            className={cx(
              'form-dropzone',
              {
                'form-dropzone--replace': !!value,
                'form-dropzone--active': isDragActive,
                'form-dropzone--accept': isDragAccept,
                'form-dropzone--reject': isDragReject,
                'form-dropzone--disabled': isDragDisabled,
              },
            )}
          >
            <input {...getInputProps()} />
            <div className="form-dropzone__message">{dropMessage}</div>
            { value &&
              <div className="form-dropzone__preview">
                {children}
              </div>
            }
          </div>
        )
      }
    </ReactDropzone>
  );
};

Dropzone.propTypes = {
  accept: PropTypes.string,
  value: PropTypes.any,
  children: PropTypes.func,
  onDrop: PropTypes.func.isRequired,
  onBrowseLibrary: PropTypes.func,
};

Dropzone.defaultProps = {
  accept: '',
  value: null,
  onBrowseLibrary: null,
  children: value => value,
};

export { Dropzone };

export default Dropzone;
