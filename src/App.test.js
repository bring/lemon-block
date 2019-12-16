import React from 'react';
import { render } from '@testing-library/react';
import SimpleStorageApp from './SimpleStorageApp';

test('renders learn react link', () => {
  const { getByText } = render(<SimpleStorageApp />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
