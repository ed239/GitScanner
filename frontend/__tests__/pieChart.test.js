import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Pie } from 'react-chartjs-2'
import html2canvas from 'html2canvas'
import PieChart from '../src/PieChart'

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,fakeData'),
  }),
}))

jest.mock('react-chartjs-2', () => ({
  Pie: jest.fn(({ ref, data, options }) => {
    if (ref && ref.current) {
      ref.current.canvas = {
        toDataURL: jest.fn().mockReturnValue('canvas-data-url'),
      }
    }
    return <div />
  }),
}))

describe('PieChart', () => {
  it('renders the commits pie chart and captures the image', async () => {
    const contributors = [
      { login: 'user1', contributions: 10 },
      { login: 'user2', contributions: 20 },
    ]
    const pullRequestsByContributor = {}
    const setChartImageCommitsPie = jest.fn()

    const { container } = render(
      <PieChart
        contributors={contributors}
        type="commits"
        pullRequestsByContributor={pullRequestsByContributor}
        setChartImageCommitsPie={setChartImageCommitsPie}
        setChartImagePullsPie={jest.fn()}
      />
    )

    await waitFor(() => {
      expect(setChartImageCommitsPie).toHaveBeenCalledWith(
        'data:image/png;base64,fakeData'
      )
    })

    // Optionally, you can check if the Pie component was rendered with the correct props
    expect(Pie).toHaveBeenCalledWith(
      expect.objectContaining({
        ref: expect.any(Function),
        data: expect.objectContaining({
          labels: ['user1', 'user2'],
          datasets: [{ data: [10, 20] }],
        }),
        options: {
          responsive: true,
          plugins: { legend: { position: 'right' } },
        },
      })
    )
  })

  it('renders the pull requests pie chart and captures the image', async () => {
    const contributors = []
    const pullRequestsByContributor = {
      user1: 5,
      user2: 10,
    }
    const setChartImageCommitsPie = jest.fn()
    const setChartImagePullsPie = jest.fn()

    const { container } = render(
      <PieChart
        contributors={contributors}
        type="pullRequests"
        pullRequestsByContributor={pullRequestsByContributor}
        setChartImageCommitsPie={setChartImageCommitsPie}
        setChartImagePullsPie={setChartImagePullsPie}
      />
    )

    await waitFor(() => {
      expect(setChartImagePullsPie).toHaveBeenCalledWith(
        'data:image/png;base64,fakeData'
      )
    })

    // Optionally, check if the Pie component was rendered with the correct props
    expect(Pie).toHaveBeenCalledWith(
      expect.objectContaining({
        ref: expect.any(Function),
        data: expect.objectContaining({
          labels: ['user1', 'user2'],
          datasets: [{ data: [5, 10] }],
        }),
        options: {
          responsive: true,
          plugins: { legend: { position: 'right' } },
        },
      })
    )
  })
})
