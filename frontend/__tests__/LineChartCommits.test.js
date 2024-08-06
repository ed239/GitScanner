import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { LineChartCommits } from './LineChartCommits' // 确保路径正确
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

// 模拟的 props
const mockCommits = [
  {
    commit: { author: { date: '2023-01-01T00:00:00Z', login: 'Alice' } },
    author: { login: 'Alice' },
  },
  {
    commit: { author: { date: '2023-01-01T00:00:00Z', login: 'Bob' } },
    author: { login: 'Bob' },
  },
  {
    commit: { author: { date: '2023-01-02T00:00:00Z', login: 'Alice' } },
    author: { login: 'Alice' },
  },
]
const mockSetChartImageCommitsLine = jest.fn()

describe('LineChartCommits', () => {
  it('renders and processes commits correctly', async () => {
    render(
      <LineChartCommits
        commits={mockCommits}
        allContributors={[]}
        setChartImageCommitsLine={mockSetChartImageCommitsLine}
      />
    )

    // 检查图表是否正确渲染
    expect(screen.getByRole('img')).toBeInTheDocument() // 假设 Line 组件渲染了一个 canvas 元素

    // 模拟 useEffect 中的 html2canvas 调用
    await waitFor(() => {
      expect(mockSetChartImageCommitsLine).toHaveBeenCalled()
    })

    // 检查传递给 setChartImageCommitsLine 的值是否为非空字符串（模拟的图片 URL）
    expect(mockSetChartImageCommitsLine.mock.calls[0][0]).toBeString()
    expect(
      mockSetChartImageCommitsLine.mock.calls[0][0].startsWith(
        'data:image/png;base64,'
      )
    ).toBeTruthy()
  })
})
