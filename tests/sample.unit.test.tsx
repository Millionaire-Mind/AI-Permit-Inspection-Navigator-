import { render, screen } from '@testing-library/react';

function Hello() { return <div>Hello World</div>; }

test('renders hello', () => {
  render(<Hello />);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});

