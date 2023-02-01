import * as React from 'react';
import { render } from '@testing-library/react';

import { MapPage } from '..';

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

describe('<MapPage  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<MapPage />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
