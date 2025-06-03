import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { times } from 'lodash';
import { Spinner, Icon } from '@codaco/ui';
import { openDialog } from '@app/utils/dialogs';
import useTimer from './useTimer';
import { acceptsPaths, getRejectedExtensions, getAcceptsExtensions } from './helpers';

const initialState = {
  isActive: false, // is doing something
  isAcceptable: false, // can accept file
  isDisabled: false, // is disabled
  isLoading: false, // file is being imported
  isError: false,
  error: null,
};

const Dropzone = ({
  onDrop,
  className,
  accepts,
  disabled,
}) => {
  const [state, setState] = useState(initialState);

  const acceptsKey = accepts.toString();
  const isDisabled = disabled || state.isActive;

  useTimer(() => {
    setState((previousState) => ({ ...previousState, isHover: false, isError: false }));
  }, 1000, [state.isHover, state.isError]);

  const startHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled) { return false; }

    setState((previousState) => ({ ...previousState, isActive: true }));

    return true;
  };

  const resetState = () => {
    setState((previousState) => ({ ...previousState, ...initialState }));
  };

  const submitPaths = (filePaths) => {
    const isAcceptable = acceptsPaths(accepts, filePaths);

    if (!isAcceptable) {
      const extensions = getRejectedExtensions(accepts, filePaths);
      const errorMessage = `This asset type does not support ${extensions.join(', ')} extension(s). Supported types are: ${accepts.join(', ')}.`;
      setState((previousState) => ({
        ...previousState,
        isActive: false,
        isError: true,
        error: errorMessage,
      }));
      return;
    }

    setState((previousState) => ({
      ...previousState,
      isAcceptable: true,
      isError: false,
      error: null,
      isLoading: true,
    }));

    onDrop(filePaths)
      .finally(resetState);
  };

  const handleClick = useCallback((e) => {
    if (!startHandler(e)) { return; }

    const extensions = getAcceptsExtensions(accepts);

    openDialog({
      filters: [
        { name: 'Asset', extensions },
      ],
      defaultPath: '',
    })
      .then(({ canceled, filePaths }) => {
        if (canceled) { resetState(); return; }

        submitPaths(filePaths);
      });
  }, [acceptsKey, isDisabled, submitPaths]);

  const handleDrop = useCallback((e) => {
    if (!startHandler(e)) { return; }

    const { files } = e.dataTransfer;
    const filePaths = times(files.length, (i) => files.item(i).path);

    // If the user drags a file attachment from a browser, we get a url instead of a file
    if (!files || filePaths.length < 1) {
      const urlName = e.dataTransfer.getData && e.dataTransfer.getData('URL');

      if (urlName) {
        const errorMessage = 'Dragging files from this source is not currently supported. Please download the file to your computer and try again.';
        setState((previousState) => ({ ...previousState, isActive: false, error: errorMessage }));
        return;
      }
    }

    submitPaths(filePaths);
  }, [acceptsKey, isDisabled, submitPaths]);

  const handleDragLeave = useCallback(() => {
    setState((previousState) => ({ ...previousState, isHover: false }));
  });

  const handleDragEnter = useCallback(() => {
    if (isDisabled) { return; }
    setState((previousState) => ({ ...previousState, isHover: true }));
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
    <div onDrop={handleDrop}>
      <div
        className={dropzoneClasses}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className={`${className}__container`} />
        <div className={`${className}__label`}>
          Drag and drop a file here to import it, or&nbsp;
          <span className={`${className}__link`}>click here to select a file from your computer</span>
          .
        </div>
        <div className={`${className}__loading`}>
          { state.isActive && <Spinner small /> }
        </div>
      </div>
      { state.error && (
        <div className={errorClasses}>
          <Icon name="warning" />
          {state.error}
        </div>
      )}
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
  // eslint-disable-next-line react/forbid-prop-types
  accepts: PropTypes.array,
  disabled: PropTypes.bool,
};

export { Dropzone };

export default Dropzone;
