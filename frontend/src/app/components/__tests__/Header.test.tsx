import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '../Header'

const mockProps = {
  onShareContent: jest.fn(),
}

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the header with correct title', () => {
    render(<Header {...mockProps} />)
    
    const title = screen.getByText('Stunning.io')
    expect(title).toBeInTheDocument()
  })

  it('renders the header with correct styling', () => {
    render(<Header {...mockProps} />)
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('bg-white', 'shadow-sm')
  })

  it('has share button that calls onShareContent when clicked', async () => {
    const user = userEvent.setup()
    render(<Header {...mockProps} />)
    
    const shareButton = screen.getByRole('button', { name: /share/i })
    await user.click(shareButton)
    
    expect(mockProps.onShareContent).toHaveBeenCalledTimes(1)
  })

  it('has proper accessibility attributes', () => {
    render(<Header {...mockProps} />)
    
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    
    const shareButton = screen.getByRole('button', { name: /share/i })
    expect(shareButton).toHaveAttribute('title', 'Share all sections')
  })
})
