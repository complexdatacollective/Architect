/* eslint-env jest */
import { vi } from 'vitest';
import { testPromptFields } from '../../CategoricalBinPrompts/__tests__/PromptFields.test.jsx';
import PromptFields from '../PromptFields';

testPromptFields(PromptFields, 'OrdinalBinPrompts');
