import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PromptInput from '../PromptInput'

const mockProps = {
  prompt: '',
  onPromptChange: jest.fn(),
  onSubmit: jest.fn(),
  isLoading: false,
}

describe('PromptInput Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the input field with correct placeholder', () => {
    render(<PromptInput {...mockProps} />)
    
    const input = screen.getByPlaceholderText('Describe your website idea...')
    expect(input).toBeInTheDocument()
  })

  it('calls onPromptChange when user types', async () => {
    const user = userEvent.setup()
    render(<PromptInput {...mockProps} />)
    
    const input = screen.getByPlaceholderText('Describe your website idea...')
    await user.type(input, 'Create a bakery website')
    
    expect(mockProps.onPromptChange).toHaveBeenCalled()
  })

  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup()
    render(<PromptInput {...mockProps} prompt="Test prompt" />)
    
    const submitButton = screen.getByRole('button', { name: /generate/i })
    await user.click(submitButton)
    
    expect(mockProps.onSubmit).toHaveBeenCalledWith('Test prompt')
  })

  it('disables input when isLoading is true', () => {
    render(<PromptInput {...mockProps} isLoading={true} />)
    
    const input = screen.getByPlaceholderText('Describe your website idea...')
    expect(input).toBeDisabled()
  })

  it('disables submit button when prompt is empty', () => {
    render(<PromptInput {...mockProps} prompt="" />)
    
    const submitButton = screen.getByRole('button', { name: /generate/i })
    expect(submitButton).toBeDisabled()
  })

  it('shows loading spinner when isLoading is true', () => {
    render(<PromptInput {...mockProps} isLoading={true} />)
    
    const spinner = screen.getByRole('button', { name: /generate/i }).querySelector('svg')
    expect(spinner).toHaveClass('animate-spin')
  })

  it('displays current prompt value', () => {
    const testPrompt = 'Create a restaurant website'
    render(<PromptInput {...mockProps} prompt={testPrompt} />)
    
    const input = screen.getByDisplayValue(testPrompt)
    expect(input).toBeInTheDocument()
  })
})
