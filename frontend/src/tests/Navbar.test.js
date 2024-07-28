import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Navbar from '../app/navbar';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Navbar component with buttons', () => {
    render(<Navbar />);
    const termProjectsButton = screen.getByText(/Term Projects/i);
    const loginButton = screen.getByText(/Login/i);
    
    expect(termProjectsButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  // Run test command：
// npm test

  test('navigates to login on button click', () => {
    render(<Navbar />);
    const loginButton = screen.getByText(/Login/i);
    fireEvent.click(loginButton);
    
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  test('navigates to term projects on button click', () => {
    render(<Navbar />);
    const termProjectsButton = screen.getByText(/Term Projects/i);
    fireEvent.click(termProjectsButton);
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
