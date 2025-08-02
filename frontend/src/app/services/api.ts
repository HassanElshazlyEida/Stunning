// API service for communicating with the backend

import { Section } from '../components/BuilderWorkspace';

// API base URL - will come from environment variables in production
const API_BASE_URL = 'http://localhost:3001';

// Interface for the response from the generate endpoint
interface GenerateResponse {
  sections: Section[];
  id: string;
}

// Interface for the history response
interface HistoryResponse {
  prompts: Array<{
    id: string;
    prompt: string;
    timestamp: string;
  }>;
}

/**
 * Generate sections based on a prompt
 */
export async function   generateSections(prompt: string): Promise<GenerateResponse> {
  try {
    // For now, simulate API call with dummy data
    // In a real implementation, this would be:
    // const response = await fetch(`${API_BASE_URL}/generate`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prompt }),
    // });
    // return await response.json();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return dummy data
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
        },
        {
          id: `section-3-${Date.now()}`,
          title: 'Contact Section',
          content: `A user-friendly contact form for "${prompt}" with fields for name, email, and message. Includes contact information and social media links.`
        }
      ]
    };
  } catch (error) {
    console.error('Error generating sections:', error);
    throw error;
  }
}

/**
 * Get prompt history
 */
export async function getPromptHistory(): Promise<string[]> {
  try {
    // For now, return empty array
    // In a real implementation, this would fetch from the API
    return [];
  } catch (error) {
    console.error('Error fetching prompt history:', error);
    throw error;
  }
}

/**
 * Save a prompt and its generated sections
 */
export async function savePromptAndSections(prompt: string, sections: Section[]): Promise<void> {
  try {
    // For now, just log to console
    // In a real implementation, this would save to the API
    console.log('Saving prompt and sections:', { prompt, sections });
  } catch (error) {
    console.error('Error saving prompt and sections:', error);
    throw error;
  }
}
