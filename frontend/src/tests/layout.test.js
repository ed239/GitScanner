import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RootLayout from '../app/layout';

jest.mock('../app/navbar', () => () => <div>Mocked Navbar</div>);

describe('RootLayout Component', () => {
  test('renders RootLayout component with Navbar', () => {
    render(<RootLayout><div>Test Child</div></RootLayout>);
    
    const navbarElement = screen.getByText(/Mocked Navbar/i);
    expect(navbarElement).toBeInTheDocument();
    
    const childElement = screen.getByText(/Test Child/i);
    expect(childElement).toBeInTheDocument();
  });

  test('renders children prop correctly', () => {
    render(<RootLayout><div>Another Child</div></RootLayout>);
    
    const childElement = screen.getByText(/Another Child/i);
    expect(childElement).toBeInTheDocument();
  });
});


// Run test command：
//npm test
