import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import LoadingPopup from '../src/app/LoadingPopup'

// Mock the CSS module
jest.mock('../src/app/LoadingPopup.module.css', () => ({
  overlay: 'overlay-class',
  popup: 'popup-class',
  spinner: 'spinner-class',
}))

describe('LoadingPopup component', () => {
  it('does not render when isVisible is false', () => {
    render(<LoadingPopup isVisible={false} />)
    expect(screen.queryByClassName('overlay-class')).not.toBeInTheDocument()
  })

  it('renders correctly when isVisible is true', () => {
    render(<LoadingPopup isVisible={true} />)

    const overlay = screen.getByClassName('overlay-class')
    const popup = screen.getByClassName('popup-class')
    const spinner = screen.getByClassName('spinner-class')
    const message = screen.getByRole('paragraph')

    expect(overlay).toBeInTheDocument()
    expect(popup).toBeInTheDocument()
    expect(spinner).toBeInTheDocument()
    expect(message).toBeInTheDocument()
    expect(message.textContent).toBe('Creating report...') // Initial message
  })

  it('updates the message periodically', async () => {
    render(<LoadingPopup isVisible={true} />)

    const message = screen.getByRole('paragraph')
    expect(message.textContent).toBe('Creating report...') // Initial check

    // Wait for the message to change
    await waitFor(
      () => {
        expect(message.textContent).not.toBe('Creating report...')
      },
      { timeout: 2000 }
    ) // Should be more than the interval in the component (1000ms)

    // Check that the message is one of the valid messages
    expect(messages.includes(message.textContent)).toBe(true)
  })
})
