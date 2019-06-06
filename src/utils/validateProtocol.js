import log from 'electron-log';
import { validateSchema, validateLogic } from '../protocol-validation/validation';
import { errToString } from '../protocol-validation/validation/helpers';

const validateProtocol = protocol =>
  new Promise((resolve, reject) => {
    log.info('validateProtocol()');

    const schemaErrors = validateSchema(protocol);
    const logicErrors = validateLogic(protocol);

    if (schemaErrors.length > 0 || logicErrors.length > 0) {
      const validationErrors = new Error([...schemaErrors, ...logicErrors].map(errToString).join(''));

      log.error(validationErrors);
      return reject(validationErrors);
    }

    log.info('validateProtocol(): valid');

    return resolve(protocol);
  });

export default validateProtocol;
