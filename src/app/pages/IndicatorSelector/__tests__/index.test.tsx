import * as React from 'react';
import { render } from '@testing-library/react';

import { IndicatorSelector } from '..';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

describe('<IndicatorSelector  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<IndicatorSelector />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
