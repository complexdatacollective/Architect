import { validateSchema, validateLogic } from '../protocol-validation/validation';
import { errToString } from '../protocol-validation/validation/helpers';

const validateProtocol = (protocol) => {
  const schemaErrors = validateSchema(protocol);
  const logicErrors = validateLogic(protocol);

  if (schemaErrors.length > 0 || logicErrors.length > 0) {
    return Promise.reject(new Error([...schemaErrors, ...logicErrors].map(errToString).join('')));
  }

  return Promise.resolve(protocol);
};

export default validateProtocol;
