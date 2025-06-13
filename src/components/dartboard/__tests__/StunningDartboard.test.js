import { render, screen } from '@testing-library/react';
import StunningDartboard from '../StunningDartboard';

describe('StunningDartboard', () => {
  it('renders heading and dartboard container', () => {
    render(<StunningDartboard />);
    expect(
      screen.getByRole('heading', { name: /precision dartboard/i })
    ).toBeInTheDocument();
    expect(document.querySelector('.dartboard-component')).toBeInTheDocument();
    expect(document.querySelector('.winner-display')).not.toBeInTheDocument();
  });
});
