import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// three.js canvases don't render under jsdom; the smoke test just checks
// that the app mounts and the hero name is present.
jest.mock('./components/background/TerminalBackground', () => () => null);
jest.mock('./components/hero/HeroTitle', () => (props: { text: string }) => (
  <h1>{props.text}</h1>
));

test('renders the hero name', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/delin shabu/i)).toBeInTheDocument();
});
