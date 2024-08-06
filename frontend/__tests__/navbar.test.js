import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Navbar from '../src/app/navbar'

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store = {}

  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

global.localStorage = localStorageMock

describe('Navbar component', () => {
  it('renders the login button when no token is present', () => {
    render(<Navbar />)

    const loginButton = screen.getByRole('button', { name: /Login/i })
    expect(loginButton).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Logout/i })
    ).not.toBeInTheDocument()
  })

  it('renders the logout button when a token is present', () => {
    localStorage.setItem('token', 'someToken')
    render(<Navbar />)

    const logoutButton = screen.getByRole('button', { name: /Logout/i })
    expect(logoutButton).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Login/i })
    ).not.toBeInTheDocument()
  })

  it('navigates to the login page when the login button is clicked', () => {
    const router = require('next/router').useRouter()
    render(<Navbar />)

    const loginButton = screen.getByRole('button', { name: /Login/i })
    fireEvent.click(loginButton)

    expect(router.push).toHaveBeenCalledWith('/login')
  })

  it('navigates to the term projects page when the term projects button is clicked', () => {
    const router = require('next/router').useRouter()
    render(<Navbar />)

    const termProjectsButton = screen.getByRole('button', {
      name: /Term Projects/i,
    })
    fireEvent.click(termProjectsButton)

    expect(router.push).toHaveBeenCalledWith('/termProjects')
  })

  it('logs out and reloads the page when the logout button is clicked', () => {
    localStorage.setItem('token', 'someToken')
    const windowSpy = jest
      .spyOn(window, 'location', 'get')
      .mockImplementation(() => ({
        reload: jest.fn(),
      }))

    render(<Navbar />)

    const logoutButton = screen.getByRole('button', { name: /Logout/i })
    fireEvent.click(logoutButton)

    expect(localStorage.clear).toHaveBeenCalled()
    expect(windowSpy.reload).toHaveBeenCalled()
  })
})
