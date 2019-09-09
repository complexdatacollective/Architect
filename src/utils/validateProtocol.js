import log from 'electron-log';
import { validateSchema, validateLogic } from '../protocol-validation/validation';
import { errToString } from '../protocol-validation/validation/helpers';

const asyncValidateSchema = async protocol =>
  new Promise((resolve, reject) => {
    try {
      const schemaErrors = validateSchema(protocol);
      resolve(schemaErrors);
    } catch (e) {
      reject(e);
    }
  });

const asyncValidateLogic = async protocol =>
  new Promise((resolve, reject) => {
    try {
      const logicErrors = validateLogic(protocol);
      resolve(logicErrors);
    } catch (e) {
      reject(e);
    }
  });

const validateProtocol = (protocol) => {
  log.debug('validateProtocol()');
  log.error(protocol.schemaVersion);
  return Promise.all([
    asyncValidateLogic(protocol),
    asyncValidateSchema(protocol),
  ])
    .catch((e) => {
      log.debug('  error in validators');
      log.error(e);
      return protocol;
    })
    .then(([logicErrors, schemaErrors]) => {
      if (schemaErrors.length > 0 || logicErrors.length > 0) {
        log.debug('  not valid');
        const validationErrors = new Error([...schemaErrors, ...logicErrors].map(errToString).join(''));

        log.error(validationErrors);
        throw validationErrors;
      }

      log.debug('  valid');

      return protocol;
    });
};

export default validateProtocol;
