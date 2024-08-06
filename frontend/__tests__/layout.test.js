import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RootLayout from '../src/app/layout'

// Mock Inter 函数，因为我们不需要在测试中实际加载字体
jest.mock('next/font/google', () => ({
  Inter: jest.fn().mockReturnValue('mockedInter'),
}))

// Mock Navbar 组件，因为我们可能不需要在测试中渲染其内部实现
jest.mock('./navbar', () => ({
  Navbar: () => <div>Mocked Navbar</div>,
}))

describe('RootLayout component', () => {
  it('renders the Navbar and children', () => {
    const children = <div>Mocked Child Content</div>
    render(<RootLayout>{children}</RootLayout>)

    // 检查 Navbar 是否被渲染
    expect(screen.getByText('Mocked Navbar')).toBeInTheDocument()

    // 检查 children 是否被渲染
    expect(screen.getByText('Mocked Child Content')).toBeInTheDocument()

    // 检查 main-content 类名的 div 是否包含 children
    expect(screen.getByRole('main')).toHaveTextContent('Mocked Child Content')
  })

  it('renders with the correct document structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    // 检查生成的 HTML 结构
    expect(container.firstChild.tagName).toBe('HTML')
    expect(container.firstChild.firstChild.tagName).toBe('BODY')
    expect(container.querySelector('.main-content')).toBeInTheDocument()
  })
})
