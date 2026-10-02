import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { afterEach, describe, expect, it } from 'vitest';

import BooleanOption from '@codaco/ui/lib/components/Boolean/BooleanOption';

// @codaco/ui's BooleanOption (used by the Boolean fields in the stage
// editors) measures itself with react-resize-aware. Its 3.1.2 and 3.1.3
// releases shipped a dist build that calls an undefined `jsx`, which crashed
// the Sociogram stage editor with "jsx is not defined". The workspace pins
// 3.1.1; this fails if the resolution moves back onto a broken build.
describe('@codaco/ui BooleanOption', () => {
  const container = document.createElement('div');

  afterEach(() => {
    unmountComponentAtNode(container);
  });

  it('renders with its resize listener', () => {
    act(() => {
      render(<BooleanOption label={() => 'Yes'} />, container);
    });

    expect(container.querySelector('.boolean-option iframe')).not.toBeNull();
  });
});
