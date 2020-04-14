import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { times } from 'lodash';
import { Spinner, Icon } from '@codaco/ui';

const { dialog } = require('electron').remote;

const getExtension = (path) => {
  const match = /(.[a-z0-9]+)$/.exec(path);
  if (!match) { return null; }
  return match[1];
};

const matchExtension = (path, extension) =>
  RegExp(`${extension}$`).test(path);

const acceptsPath = accepts => path =>
  accepts.some(accept => matchExtension(path, accept));

const acceptsPaths = (accepts, paths) => {
  if (!paths || paths.length === 0) { return false; }
  return paths.every(acceptsPath(accepts));
};

const getRejectedExtensions = (accepts, paths) =>
  paths.reduce((memo, path) => {
    if (acceptsPath(accepts)(path)) { return memo; }
    const extension = getExtension(path);
    if (memo.includes(extension)) { return memo; }
    return [...memo, extension];
  }, []);

const getAcceptsExtensions = accepts =>
  accepts.map(accept => accept.substr(1));

const initialState = {
  isActive: false, // is doing something
  isAcceptable: false, // can accept file
  isDisabled: false, // is disabled
  isLoading: false, // file is being imported
  isError: false,
  error: null,
};

const useTimer = () => {
  const timer = useRef();

  const clearTimer = () => {
    if (!timer.current) { return; }
    clearTimeout(timer.current);
  };

  const setTimer = (callback, delay) => {
    clearTimer();
    timer.current = setTimeout(callback, delay);
  };

  return setTimer;
};

const Dropzone = ({
  onDrop,
  className,
  accepts,
  disabled,
}) => {
  const [state, setState] = useState(initialState);
  const setTimer = useTimer();

  const acceptsKey = accepts.toString();
  const isDisabled = disabled || state.isActive;

  useEffect(() => {
    setTimer(() => {
      setState(previousState => ({ ...previousState, isHover: false, isError: false }));
    }, 1000);
  }, [state.isHover, state.isError]);

  const startHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled) { return false; }

    setState(previousState => ({ ...previousState, isActive: true }));

    return true;
  };

  const submitPaths = (filePaths) => {
    const isAcceptable = acceptsPaths(accepts, filePaths);

    if (!isAcceptable) {
      const extensions = getRejectedExtensions(accepts, filePaths);
      const errorMessage = `This asset type does not support ${extensions.join(', ')} extension(s).`;
      setState(previousState => ({
        ...previousState,
        isActive: false,
        isError: true,
        error: errorMessage,
      }));
      return;
    }

    setState(previousState => ({
      ...previousState,
      isAcceptable: true,
      isError: false,
      error: null,
      isLoading: true,
    }));

    onDrop(filePaths)
      .finally(() => {
        setState(previousState => ({ ...previousState, ...initialState }));
      });
  };

  const handleClick = useCallback((e) => {
    if (!startHandler(e)) { return; }

    const extensions = getAcceptsExtensions(accepts);

    dialog.showOpenDialog({
      filters: [
        { name: 'Asset', extensions },
      ],
    }, filePaths => submitPaths(filePaths));
  }, [acceptsKey, isDisabled, submitPaths]);

  const handleDrop = useCallback((e) => {
    if (!startHandler(e)) { return; }

    const files = e.dataTransfer.files;
    const filePaths = times(files.length, i => files.item(i).path);

    // If the user drags a file attachment from a browser, we get a url instead of a file
    if (!files || filePaths.length < 1) {
      const urlName = e.dataTransfer.getData && e.dataTransfer.getData('URL');

      if (urlName) {
        const errorMessage = 'Dragging files from this source is not currently supported. Please download the file to your computer and try again.';
        setState(previousState => ({ ...previousState, isActive: false, error: errorMessage }));
        return;
      }
    }

    submitPaths(filePaths);
  }, [acceptsKey, isDisabled, submitPaths]);

  const handleDragExit = useCallback(() => {
    setState(previousState => ({ ...previousState, isHover: false }));
  });

  const handleDragEnter = useCallback(() => {
    if (isDisabled) { return; }
    setState(previousState => ({ ...previousState, isHover: true }));
  }, [isDisabled]);

  const dropzoneClasses = cx(
    className,
    {
      [`${className}--active`]: state.isActive,
      [`${className}--hover`]: state.isHover,
      [`${className}--loading`]: state.isLoading,
      [`${className}--error`]: state.isError,
      [`${className}--disabled`]: isDisabled,
    },
  );

  const errorClasses = cx(
    `${className}__error`,
    {
      [`${className}__error--show`]: state.error,
    },
  );

  return (
    <div
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragExit={handleDragExit}
    >
      <div className={dropzoneClasses} onClick={handleClick}>
        <div className={`${className}__container`} />
        <div className={`${className}__label`}>
          Drop a file here or&nbsp;
          <div className={`${className}__link`}>click to browse</div>
        </div>
        <div className={`${className}__loading`}>
          { state.isActive && <Spinner small /> }
        </div>
      </div>
      <div className={errorClasses}>
        <Icon name="warning" />
        {state.error}
      </div>
    </div>
  );
};

Dropzone.defaultProps = {
  className: 'form-dropzone',
  accepts: [],
  disabled: false,
};

Dropzone.propTypes = {
  onDrop: PropTypes.func.isRequired,
  className: PropTypes.string,
  accepts: PropTypes.array,
  disabled: PropTypes.bool,
};

export { Dropzone };

export default Dropzone;
