import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SectionDisplay from '../SectionDisplay'

const mockSections = [
  {
    id: '1',
    title: 'Hero',
    content: '<div>Hero Section Content</div>',
  },
  {
    id: '2',
    title: 'About',
    content: '<div>About Section Content</div>',
  },
]

const mockProps = {
  sections: mockSections,
  isPreviewMode: false,
  onTogglePreview: jest.fn(),
  onCopyAll: jest.fn(),
}

describe('SectionDisplay Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders sections in card mode', () => {
    render(<SectionDisplay {...mockProps} />)
    
    expect(screen.getByText('Hero')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders sections in preview mode', () => {
    render(<SectionDisplay {...mockProps} isPreviewMode={true} />)
    
    // In preview mode, sections should be rendered as HTML
    expect(screen.getByText('Hero Section Content')).toBeInTheDocument()
    expect(screen.getByText('About Section Content')).toBeInTheDocument()
  })

  it('calls onTogglePreview when preview button is clicked', async () => {
    const user = userEvent.setup()
    render(<SectionDisplay {...mockProps} />)
    
    const previewButton = screen.getByRole('button', { name: /preview/i })
    await user.click(previewButton)
    
    expect(mockProps.onTogglePreview).toHaveBeenCalled()
  })

  it('calls onCopyAll when copy all button is clicked', async () => {
    const user = userEvent.setup()
    render(<SectionDisplay {...mockProps} />)
    
    const copyButton = screen.getByRole('button', { name: /copy all/i })
    await user.click(copyButton)
    
    expect(mockProps.onCopyAll).toHaveBeenCalled()
  })

  it('displays empty state when no sections provided', () => {
    render(<SectionDisplay {...mockProps} sections={[]} />)
    
    expect(screen.getByText(/no sections generated/i)).toBeInTheDocument()
  })

  it('handles HTML content safely', () => {
    const sectionsWithScript = [
      {
        id: '1',
        title: 'Test',
        content: '<script>alert("xss")</script><div>Safe content</div>',
      },
    ]
    
    render(<SectionDisplay {...mockProps} sections={sectionsWithScript} />)
    
    // Script tags should be sanitized
    expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument()
    expect(screen.getByText('Safe content')).toBeInTheDocument()
  })

  it('shows correct button states in different modes', () => {
    const { rerender } = render(<SectionDisplay {...mockProps} />)
    
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument()
    
    rerender(<SectionDisplay {...mockProps} isPreviewMode={true} />)
    expect(screen.getByRole('button', { name: /sections/i })).toBeInTheDocument()
  })
})
