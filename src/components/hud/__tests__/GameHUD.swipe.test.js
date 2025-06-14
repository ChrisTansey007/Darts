import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GameHUD from '../GameHUD'

describe('GameHUD swipe gestures', () => {
  it('collapses right panel on swipe right', async () => {
    const user = userEvent.setup()
    render(<GameHUD />)
    const panel = document.querySelector('.hud-side.right')
    expect(panel.classList.contains('collapsed')).toBe(false)
    await user.pointer([
      { keys: '[TouchA>', target: panel, coords: { x: 150, y: 10 } },
      { keys: '[/TouchA]', target: panel, coords: { x: 10, y: 10 } },
    ])
    expect(panel.classList.contains('collapsed')).toBe(true)
  })
})
