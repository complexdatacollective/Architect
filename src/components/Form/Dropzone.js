import React, { useCallback, useRef } from 'react';
import cx from 'classnames';
import { useDropzone } from 'react-dropzone';

const Dropzone = ({
  // onDrop,
  accepts,
  disabled,
}) => {
  console.log('render');

  const ref = useRef();

  const onDrop = useCallback((acceptedFiles) => {
    // console.log(acceptedFiles);
    // acceptedFiles.forEach((file) => {
      // const reader = new FileReader();

      // reader.onabort = () => console.log('file reading was aborted');
      // reader.onerror = () => console.log('file reading has failed');
      // reader.onload = () => {
      // // Do whatever you want with the file contents
      //   const binaryStr = reader.result;
      //   console.log(binaryStr);
      // };
      // reader.readAsArrayBuffer(file);
    // });
  }, []);

  // const {
  //   getRootProps,
  //   getInputProps,
  //   isDragActive,
  //   isDragAccept,
  //   isDragReject,
  //   isDragDisabled,
  // } = useDropzone({
  //   onDrop,
  //   accepts,
  //   disabled,
  // });

  return (
    <div onClick={() => { ref.current && ref.current.click(); }}>
      <div>
      {/* <div
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
      > */}
        <div className="form-dropzone__container" />
        <div className="form-dropzone__label">
          Drop a file here or&nbsp;<div className="form-dropzone__link">click to browse</div>
        </div>
        {/* <input {...getInputProps()} /> */}

      </div>
      <br /><br /><br />
      <input
        ref={ref}
        type="file"
        multiple
        onChange={() => {}}
      />
    </div>
  );
};

export { Dropzone };

export default Dropzone;
