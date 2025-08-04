import { generateSections, checkSessionPrompts, deletePrompt } from '../api'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('API Service', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('generateSections', () => {
    it('should call the correct endpoint with proper data', async () => {
      const mockResponse = {
        _id: 'test-id',
        text: 'Create a bakery website',
        sections: [
          { title: 'Hero', content: '<div>Hero</div>' }
        ]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await generateSections('Create a bakery website')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/prompts/generate',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('Create a bakery website')
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(generateSections('test prompt')).rejects.toThrow()
    })
  })

  describe('checkSessionPrompts', () => {
    it('should fetch session prompts', async () => {
      const mockPrompts = [
        { _id: '1', text: 'Prompt 1', isActive: true },
        { _id: '2', text: 'Prompt 2', isActive: false }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPrompts,
      } as Response)

      const result = await checkSessionPrompts()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/prompts/history'),
        expect.objectContaining({
          method: 'GET'
        })
      )

      expect(result.prompts).toEqual(mockPrompts)
    })
  })

  describe('deletePrompt', () => {
    it('should delete a prompt', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ deleted: true }),
      } as Response)

      const result = await deletePrompt('test-id')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/prompts/test-id',
        expect.objectContaining({
          method: 'DELETE'
        })
      )

      expect(result).toEqual({ deleted: true })
    })
  })
})
