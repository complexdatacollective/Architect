import log from '@utils/logger';

const errors = {
  CreateFailed: 'CreateFailed', // Netcanvas file could not be generated
  IncorrectPermissions: 'IncorrectPermissions', // File does not have read/write permissions
  MigrationFailed: 'MigrationFailed', // Protocol could not be migrated
  MissingSchemaVersion: 'MissingSchemaVersion', // Protocol does not contain schema version
  NotFound: 'NotFound', // File could not be found
  OpenFailed: 'OpenFailed', // Netcanvas file could not be opened
  ReadError: 'ReadError', // File could not be read
  SaveFailed: 'SaveFailed', // Netcanvas file could not be saved
  VerificationFailed: 'VerificationFailed', // Netcanvas file could not be verifed
  WriteError: 'WriteError', // File could not be written
};

/**
 * Helper function generator for use with `.catch()`. The original error
 * is logged, and then substituted for the custom error object, which is
 * thrown.
 * @param readableError An error object
 * @returns {function} A function that can be used inside .catch();
 */
const getFriendlyError = (e, friendlyCode) => {
  e.friendlyCode = friendlyCode;
  return e;
};

const handleError = (defaultError) => (e) => {
  log.error(e);

  if (!e) {
    throw getFriendlyError(new Error('No error to handle'), defaultError);
  }

  switch (e.code) {
    case 'EACCES':
      throw getFriendlyError(e, errors.IncorrectPermissions);
    case 'ENOENT':
      throw getFriendlyError(e, errors.NotFound);
    default:
      throw getFriendlyError(e, defaultError);
  }
};

export {
  handleError,
  errors,
};
