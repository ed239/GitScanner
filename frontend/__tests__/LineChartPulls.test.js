import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import LineChartPulls from '../src/LineChartPulls' // 确保路径正确
import html2canvas from 'html2canvas'
jest.mock('html2canvas')
// 模拟的 props
const mockPulls = [
  {
    created_at: '2023-01-01T00:00:00Z',
    merged_at: '2023-01-02T00:00:00Z',
    user: { login: 'Alice' },
  },
  {
    created_at: '2023-01-01T00:00:00Z',
    merged_at: '2023-01-02T00:00:00Z',
    user: { login: 'Bob' },
  },
  {
    created_at: '2023-01-02T00:00:00Z',
    merged_at: '2023-01-03T00:00:00Z',
    user: { login: 'Alice' },
  },
]
const mockAllContributors = [] // 根据需要调整
const mockSetChartImagePullsLine = jest.fn()
describe('LineChartPulls', () => {
  it('should process pulls and set chart image URL', async () => {
    // 模拟 html2canvas 的行为
    const mockCanvas = {
      toDataURL: jest
        .fn()
        .mockReturnValue('data:image/png;base64,fakeImageData'),
    }
    html2canvas.mockResolvedValue(mockCanvas)
    // 使用 renderHook 而不是 render，因为我们只关心 hooks 的行为
    const { result, rerender } = renderHook(() =>
      LineChartPulls({
        pulls: mockPulls,
        allContributors: mockAllContributors,
        setChartImagePullsLine: mockSetChartImagePullsLine,
      })
    )
    act(() => {
      rerender()
    })

    // 等待异步操作完成
    await new Promise((resolve) => setTimeout(resolve, 0)) // 模拟异步等待

    // 验证 setChartImagePullsLine 是否被调用
    expect(mockSetChartImagePullsLine).toHaveBeenCalled()
    expect(mockSetChartImagePullsLine.mock.calls[0][0]).toBe(
      'data:image/png;base64,fakeImageData'
    )

    // 注意：由于我们没有实际渲染 <Line /> 组件，所以无法验证其 props 或渲染结果
    // 如果需要验证 <Line /> 组件的渲染，你可能需要使用 shallow rendering 或其他测试方法
  })
})
