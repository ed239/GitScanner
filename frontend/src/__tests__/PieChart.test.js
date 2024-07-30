import React from 'react';
import { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PieChart from '../PieChart';
import html2canvas from 'html2canvas';

jest.mock('html2canvas', () => jest.fn());

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('PieChart Component', () => {
  const mockSetChartImageCommitsPie = jest.fn();
  const mockSetChartImagePullsPie = jest.fn();

  const contributors = [
    { login: 'contributor1', contributions: 10 },
    { login: 'contributor2', contributions: 20 },
  ];

  const pullRequestsByContributor = {
    contributor1: 5,
    contributor2: 15,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders PieChart component for commits', async () => {
    await act(async () => {
      render(
        <PieChart
          contributors={contributors}
          type="commits"
          pullRequestsByContributor={pullRequestsByContributor}
          setChartImageCommitsPie={mockSetChartImageCommitsPie}
          setChartImagePullsPie={mockSetChartImagePullsPie}
        />
      );
    });

    // Check if the contributors' names are in the document
    expect(screen.getByText('contributor1')).toBeInTheDocument();
    expect(screen.getByText('contributor2')).toBeInTheDocument();
  });

  test('renders PieChart component for pull requests', async () => {
    await act(async () => {
      render(
        <PieChart
          contributors={contributors}
          type="pulls"
          pullRequestsByContributor={pullRequestsByContributor}
          setChartImageCommitsPie={mockSetChartImageCommitsPie}
          setChartImagePullsPie={mockSetChartImagePullsPie}
        />
      );
    });

    // Check if the contributors' names are in the document
    expect(screen.getByText('contributor1')).toBeInTheDocument();
    expect(screen.getByText('contributor2')).toBeInTheDocument();
  });

  test('calls setChartImageCommitsPie on commits type', async () => {
    const canvas = document.createElement('canvas');
    html2canvas.mockResolvedValueOnce(canvas);

    await act(async () => {
      const { container } = render(
        <PieChart
          contributors={contributors}
          type="commits"
          pullRequestsByContributor={pullRequestsByContributor}
          setChartImageCommitsPie={mockSetChartImageCommitsPie}
          setChartImagePullsPie={mockSetChartImagePullsPie}
        />
      );

      container.appendChild(canvas);

      await waitFor(() => {
        expect(html2canvas).toHaveBeenCalled(); // 检查是否调用了 html2canvas
        expect(mockSetChartImageCommitsPie).toHaveBeenCalled();
      });
    });
  });

  test('calls setChartImagePullsPie on pulls type', async () => {
    const canvas = document.createElement('canvas');
    html2canvas.mockResolvedValueOnce(canvas);

    await act(async () => {
      const { container } = render(
        <PieChart
          contributors={contributors}
          type="pulls"
          pullRequestsByContributor={pullRequestsByContributor}
          setChartImageCommitsPie={mockSetChartImageCommitsPie}
          setChartImagePullsPie={mockSetChartImagePullsPie}
        />
      );

      container.appendChild(canvas);

      await waitFor(() => {
        expect(html2canvas).toHaveBeenCalled(); // 检查是否调用了 html2canvas
        expect(mockSetChartImagePullsPie).toHaveBeenCalled();
      });
    });
  });
});
