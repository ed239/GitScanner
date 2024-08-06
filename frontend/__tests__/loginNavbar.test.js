import React from 'react'
import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'
import { useRouter as mockUseRouter } from 'next/dist/client/router'
import '@testing-library/jest-dom/extend-expect'
import loginNavbar from '../src/pages/components/loginNavbar'

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}))

describe('loginNavbar component', () => {
  it('renders the navbar with the correct class names', () => {
    render(<loginNavbar />)

    const navbar = screen.getByRole('navigation', { name: /loginNavbar/i })
    expect(navbar).toHaveClass('navbar') // Assuming styles.navbar is 'navbar'

    const navList = screen.getByRole('list', { name: /navbar list/i })
    expect(navList).toHaveClass('navList') // Assuming styles.navList is 'navList'

    const navItem = screen.getByRole('listItem', { name: /nav item/i })
    expect(navItem).toHaveClass('navItem') // Assuming styles.navItem is 'navItem'

    const loginButton = screen.getByRole('button', { name: /home/i })
    expect(loginButton).toHaveClass('loginButton') // Assuming styles.loginButton is 'loginButton'
  })

  it('navigates to home when the Home button is clicked', () => {
    const pushMock = jest.fn()
    mockUseRouter.mockImplementation(() => ({ push: pushMock }))

    render(<loginNavbar />)

    const loginButton = screen.getByRole('button', { name: /home/i })
    loginButton.click()

    expect(pushMock).toHaveBeenCalledWith('/')
  })
})
