import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'; // Ensures this is loaded

import LineChartCommits from '../LineChartCommits';

const mockCommits = [
  {
    commit: {
      author: {
        name: 'John Doe',
        date: '2023-07-27T14:48:00.000Z',
      },
    },
    author: {
      login: 'johndoe',
    },
  },
  {
    commit: {
      author: {
        name: 'Jane Smith',
        date: '2023-07-26T12:34:00.000Z',
      },
    },
    author: {
      login: 'janesmith',
    },
  },
];

const mockAllContributors = [
  { login: 'johndoe' },
  { login: 'janesmith' },
];

test('renders LineChartCommits component', () => {
  const { container } = render(
    <LineChartCommits
      commits={mockCommits}
      allContributors={mockAllContributors}
      setChartImageCommitsLine={() => {}}
    />
  );

  expect(container).toBeInTheDocument();
});

