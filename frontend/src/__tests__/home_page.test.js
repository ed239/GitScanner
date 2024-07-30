import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../app/page.js';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mocking the necessary modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('axios');
jest.mock('../pdfGenerator', () => jest.fn());
jest.mock('../PieChart', () => () => <div>Mock PieChart</div>);
jest.mock('../LineChartCommits', () => () => <div>Mock LineChartCommits</div>);
jest.mock('../LineChartPulls', () => () => <div>Mock LineChartPulls</div>);
// jest.mock('../app/LoadingPopup', () => ({ isVisible }) => (isVisible ? <div>Loading...</div> : null));

describe('Home', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Home component', () => {
    render(<Home />);
    expect(screen.getByText('Git Scanner')).toBeInTheDocument();
  });

  test('adds a new link input on button click', () => {
    render(<Home />);
    const addButton = screen.getByText('Add Link');
    fireEvent.click(addButton);
    const inputs = screen.getAllByPlaceholderText('Enter GitHub repo link');
    expect(inputs).toHaveLength(2);
  });

  test('handles form submission', async () => {
    axios.post.mockResolvedValue({ data: { repoData: { name: 'test-repo' }, contributors: [], languages: {}, pulls: [] } });

    render(<Home />);
    const input = screen.getByPlaceholderText('Enter GitHub repo link');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'https://github.com/ShiArthur03/ShiArthur03' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const elements = screen.getAllByText('test-repo');
      expect(elements.length).toBeGreaterThan(0);
      expect(elements[0]).toBeInTheDocument();
    });
  });

  test('displays error message for invalid link', () => {
    render(<Home />);
    const input = screen.getByPlaceholderText('Enter GitHub repo link');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'invalid-link' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Invalid GitHub repository link')).toBeInTheDocument();
  });

  test('handles PDF generation button click', async () => {
    axios.post.mockResolvedValue({ data: { repoData: { name: 'test-repo' }, contributors: [], languages: {}, pulls: [] } });

    render(<Home />);
    const input = screen.getByPlaceholderText('Enter GitHub repo link');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'https://github.com/ShiArthur03/ShiArthur03' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Download PDF/i })).toBeInTheDocument();
    });

    const pdfButton = screen.getByRole('button', { name: /Download PDF/i });
    fireEvent.click(pdfButton);

  });
});
