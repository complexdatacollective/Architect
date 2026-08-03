import { getValidations } from '@app/utils/validations';
import { useMemo } from 'react';

const useValidate = (validation) => {
  const validate = useMemo(() => getValidations(validation), []);

  return validate;
};

export default useValidate;
