import { render, screen } from '@testing-library/react'
import GameHUD from '../GameHUD'

describe('GameHUD', () => {
  it('renders dartboard and hud sections', () => {
    render(<GameHUD />)
    expect(
      screen.getByRole('heading', { name: /precision dartboard/i })
    ).toBeInTheDocument()
    expect(document.querySelector('.hud-top-bar')).toBeInTheDocument()
    expect(document.querySelectorAll('.hud-side').length).toBe(2)
    expect(document.querySelector('.hud-bottom')).toBeInTheDocument()
  })
})
