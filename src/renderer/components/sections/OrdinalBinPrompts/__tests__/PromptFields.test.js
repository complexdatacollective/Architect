/* eslint-env jest */
import { testPromptFields } from '../../CategoricalBinPrompts/__tests__/PromptFields.test';
import PromptFields from '../PromptFields';

// jest.mock('@components/NewVariableWindow');

testPromptFields(PromptFields);
