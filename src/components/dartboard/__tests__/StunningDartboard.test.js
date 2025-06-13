import { render, screen, fireEvent } from '@testing-library/react';
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

  it('toggles board visibility when button clicked', () => {
    render(<StunningDartboard />);
    fireEvent.click(screen.getByRole('button', { name: 'Cricket' }));
    const toggleBtn = screen.getByRole('button', { name: /hide board/i });
    expect(document.querySelector('svg.dartboard-svg')).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    expect(document.querySelector('svg.dartboard-svg')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show board/i })).toBeInTheDocument();
  });

  it('updates marks when number cell clicked', () => {
    render(<StunningDartboard />);
    fireEvent.click(screen.getByRole('button', { name: 'Cricket' }));
    const markCell = document.querySelectorAll('.marks-display')[0];
    expect(markCell.textContent).toBe('');
    const numberCell = document.querySelectorAll('.cricket-number')[1];
    fireEvent.click(numberCell);
    const updatedMark = document.querySelectorAll('.marks-display')[0];
    expect(updatedMark.textContent).toBe('/');
  });
});
