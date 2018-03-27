import { Field } from 'redux-form';
import withValidation from '../../behaviours/withValidation';

const ValidatedField = withValidation(Field);

export default ValidatedField;
