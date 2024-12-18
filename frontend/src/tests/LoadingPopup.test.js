import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoadingPopup from '../app/LoadingPopup';

describe('LoadingPopup Component', () => {
  test('renders LoadingPopup component with initial message', () => {
    render(<LoadingPopup isVisible={true} />);
    const messageElement = screen.getByText(/Creating report.../i);
    expect(messageElement).toBeInTheDocument();
  });

  test('changes messages every 2 seconds', async () => {
    jest.useFakeTimers();
    render(<LoadingPopup isVisible={true} />);
    
    expect(screen.getByText(/Creating report.../i)).toBeInTheDocument();
    jest.advanceTimersByTime(500);
    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
    jest.advanceTimersByTime(500);
    expect(screen.getByText(/This may take up to a minute.../i)).toBeInTheDocument();
    jest.advanceTimersByTime(500);
    expect(screen.getByText(/Creating report.../i)).toBeInTheDocument();

    jest.useRealTimers();
  });

  test('does not render when isVisible is false', () => {
    render(<LoadingPopup isVisible={false} />);
    const messageElement = screen.queryByText(/Creating report.../i);
    expect(messageElement).not.toBeInTheDocument();
  });
});


// Run test command：
// npm test
