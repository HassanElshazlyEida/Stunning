// API service for communicating with the backend

import { Section } from '../components/BuilderWorkspace';

// API base URL - will come from environment variables in production
const API_BASE_URL = 'http://localhost:3001/api';

// Interface for prompt data
export interface PromptData {
  _id: string;
  text: string;
  sections: { title: string; content: string }[];
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean; // Flag to track the currently active prompt
}

// Get or create session ID - using a stable identifier for the user/device
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    // Create a stable session ID with a fixed prefix and a random string
    // This will remain consistent for this user/browser until localStorage is cleared
    const randomId = Math.random().toString(36).substring(2, 15);
    sessionId = `session-${randomId}`;
    localStorage.setItem('sessionId', sessionId);
    console.log('Created new session ID:', sessionId);
  } else {
    console.log('Using existing session ID:', sessionId);
  }
  return sessionId;
};

// Interface for the response from the generate endpoint
interface GenerateResponse {
  sections: Section[];
  id: string;
}

// Interface for the history response
interface HistoryResponse {
  prompts: Array<{
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

/**
 * Generate sections based on a prompt
 * This function sends the prompt to the backend API and includes the session ID
 */
export async function generateSections(prompt: string): Promise<GenerateResponse> {
  try {
    // Get session ID for this request
    const sessionId = getSessionId();
    console.log('Generating sections with session ID:', sessionId);
    
    const response = await fetch(`${API_BASE_URL}/prompts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: prompt,
        sessionId // Include the session ID with the request
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the response to match our interface
    return {
      id: data._id || `gen-${Date.now()}`,
      sections: data.sections.map((section: any, index: number) => ({
        id: `section-${index}-${Date.now()}`,
        title: section.title,
        content: section.content
      }))
    };
  } catch (error) {
    console.error('Error generating sections:', error);
    // Fallback to dummy data if API fails
    return {
      id: `gen-${Date.now()}`,
      sections: [
        {
          id: `section-1-${Date.now()}`,
          title: 'Hero Section',
          content: `A stunning hero section for "${prompt}" with a captivating headline, engaging subtext, and a clear call-to-action button.`
        },
        {
          id: `section-2-${Date.now()}`,
          title: 'About Section',
          content: `An informative about section that explains the purpose and value proposition of "${prompt}". Includes key features and benefits.`
        }
      ]
    };
  }
}

/**
 * Get prompt history with timestamps
 */
export interface PromptHistoryItem {
  _id: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean; // Flag to track the currently active prompt
}

export const getPromptHistory = async (): Promise<PromptHistoryItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/prompts/history`);
    if (!response.ok) throw new Error('Failed to fetch prompt history');
    
    const data = await response.json();
    return data.map((prompt: any) => ({
      _id: prompt._id,
      text: prompt.text,
      createdAt: prompt.createdAt || new Date().toISOString(),
      updatedAt: prompt.updatedAt,
      isActive: false // Initialize all prompts as inactive
    }));
  } catch (error) {
    console.error('Error fetching prompt history:', error);
    // Return empty array as fallback
    return [];
  }
};

// Check if session has prompts and return them
export async function checkSessionPrompts(): Promise<{ hasPrompts: boolean; prompts: PromptData[] }> {
  try {
    const sessionId = getSessionId();
    const response = await fetch(`${API_BASE_URL}/prompts/session/${sessionId}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const prompts = await response.json();
    
    // Add isActive property to the most recent prompt
    const processedPrompts = prompts && prompts.length > 0 ? 
      prompts.map((prompt: any, index: number) => ({
        ...prompt,
        isActive: index === 0 // Mark the most recent prompt as active
      })) : [];
      
    return { 
      hasPrompts: processedPrompts.length > 0,
      prompts: processedPrompts
    };
  } catch (error) {
    console.error('Error checking session prompts:', error);
    return { hasPrompts: false, prompts: [] };
  }
};

/**
 * Save a prompt and its generated sections
 */
export const savePromptAndSections = async (text: string, sections: Section[]): Promise<void> => {
  try {
    // Get session ID - this will create it if it doesn't exist
    const sessionId = getSessionId();
    
    await fetch(`${API_BASE_URL}/prompts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, sessionId, sections }),
    });
    
    // No need to set sessionId again here since getSessionId() already handles this
    
    console.log('Saved prompt and sections successfully');
  } catch (error) {
    console.error('Error saving prompt and sections:', error);
    // We don't throw here to prevent UI disruption
  }
}

/**
 * Delete a prompt by its ID
 */
export const deletePrompt = async (id: string): Promise<boolean> => {
  try {
    console.log(`API: Deleting prompt with ID: ${id}`);

    
    // Validate MongoDB ID format (24 hex characters)
    const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidMongoId) {
      console.error('Invalid MongoDB ID format:', id);
      return false;
    }
    
    const response = await fetch(`${API_BASE_URL}/prompts/${id}`, {
      method: 'DELETE',
    });
    
    console.log('Delete response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to delete prompt: ${response.status}`, errorText);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return false;
  }
}
