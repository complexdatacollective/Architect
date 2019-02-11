import React from 'react';
import cx from 'classnames';
import ReactDropzone from 'react-dropzone';

const Dropzone = ({
  onDrop,
  accepts,
}) => (
  <ReactDropzone
    onDrop={onDrop}
    multiple={false}
    accept={accepts}
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
              'form-dropzone--active': isDragActive,
              'form-dropzone--accept': isDragAccept,
              'form-dropzone--reject': isDragReject,
              'form-dropzone--disabled': isDragDisabled,
            },
          )}
        >
          <input {...getInputProps()} />
          Drop file here or click to choose file.
        </div>
      )
    }
  </ReactDropzone>
);

export { Dropzone };

export default Dropzone;
