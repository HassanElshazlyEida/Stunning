"use client";

import { useState, useEffect } from "react";
import BuilderWorkspace, { Section } from "./components/BuilderWorkspace";
import { generateSections, checkSessionPrompts, PromptHistoryItem, deletePrompt } from "./services/api";

// CSS imports
import "./styles/cloud-animations.css";
import "./styles/custom-scrollbar.css";

// Sample prompt suggestions
const PROMPT_SUGGESTIONS = [
  "Build E-commerce website",
  "Design a personal portfolio",
  "Launch a SaaS landing page",
  "Create a blog website",
  "Build a restaurant website",
  "Design a travel agency site",
  "Create a fitness app landing page",
  "Build a real estate website",
];

export default function Home() {
  // State for home screen
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  // State for builder workspace
  const [isBuilderMode, setIsBuilderMode] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Rotate through suggestions every 3 seconds
  useEffect(() => {
    if (!isBuilderMode) {
      const interval = setInterval(() => {
        setCurrentSuggestion((prev) => (prev + 1) % PROMPT_SUGGESTIONS.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isBuilderMode]);
  
  // Check for existing session prompts on initial load
  useEffect(() => {
    async function initializeApp() {
      try {
        // Check if user has prompts in the current session
        const sessionData = await checkSessionPrompts();
        
        // If prompts exist for this session, switch to builder mode
        if (sessionData.hasPrompts && sessionData.prompts.length > 0) {
          console.log('Found existing prompts for this session, switching to builder mode');
          setIsBuilderMode(true);
          
          // Use the session prompts directly instead of making another API call
          const sessionPrompts = sessionData.prompts.map(prompt => ({
            _id: prompt._id,
            text: prompt.text,
            createdAt: prompt.createdAt || new Date().toISOString(),
            updatedAt: prompt.updatedAt,
            isActive: prompt.isActive || false // Preserve isActive property from API
          }));
          setPromptHistory(sessionPrompts);
          
          // Use the most recent prompt
          const mostRecentPrompt = sessionData.prompts[0].text;
          setCurrentPrompt(mostRecentPrompt);
          
          // Use the sections from the most recent prompt
          if (sessionData.prompts[0].sections) {
            // Add id to each section to match the Section interface
            const sectionsWithId = sessionData.prompts[0].sections.map((section, index) => ({
              ...section,
              id: `section-${index}`
            }));
            setSections(sectionsWithId);
          } else {
            // Only generate sections if they don't exist
            generateSectionsFromPrompt(mostRecentPrompt);
          }
        }
      } catch (err) {
        console.error('Error initializing app:', err);
        setError(null); // Don't show error for this as it's not critical
      }
    }
    
    initializeApp();
  }, []);
  
  // Handle input focus
  const handleFocus = () => setInputFocused(true);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Transition to builder mode
      setCurrentPrompt(inputValue);
      setIsBuilderMode(true);
      await generateSectionsFromPrompt(inputValue);
      
      const newPromptItem: PromptHistoryItem = {
        _id: `temp-${Date.now()}`, // Temporary ID until backend assigns one
        text: inputValue,
        createdAt: new Date().toISOString(),
      };
      setPromptHistory([newPromptItem, ...promptHistory]);
    }
  };
  
  // Generate sections from a prompt
  const generateSectionsFromPrompt = async (prompt: string) => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      // The generateSections function handles sending the session ID to the backend
      const response = await generateSections(prompt);
      setSections(response.sections);
      
      // Store in localStorage for offline access
      try {
        localStorage.setItem('lastPrompt', prompt);
        localStorage.setItem('lastSections', JSON.stringify(response.sections));
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }
    } catch (error) {
      console.error("Error generating sections:", error);
      setError("Failed to generate website sections. Please try again.");
      
      // Try to load from localStorage as fallback
      try {
        const lastPrompt = localStorage.getItem('lastPrompt');
        const lastSections = localStorage.getItem('lastSections');
        
        if (lastPrompt && lastSections && lastPrompt === prompt) {
          setSections(JSON.parse(lastSections));
          setError("Using cached results due to connection issues.");
        }
      } catch (err) {
        console.error('Fallback error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle prompt change in builder mode
  const handlePromptChange = async (newPrompt: string) => {
    if (newPrompt !== currentPrompt) {
      setCurrentPrompt(newPrompt);
      
      // Reset active state for all prompts
      const updatedHistory = promptHistory.map(item => ({
        ...item,
        isActive: false
      }));
      
      // Create temporary prompt item for immediate UI update
      const tempPromptItem: PromptHistoryItem = {
        _id: `temp-${Date.now()}`, // Temporary ID until backend assigns one
        text: newPrompt,
        createdAt: new Date().toISOString(),
        isActive: true // Mark as active
      };
      
      // Update history immediately for better UX
      setPromptHistory([tempPromptItem, ...updatedHistory]);
      
      // Generate sections for the new prompt
      await generateSectionsFromPrompt(newPrompt);
      
      // After generating sections, refresh the prompt history to get the real ID from backend
      try {
        const sessionData = await checkSessionPrompts();
        if (sessionData.hasPrompts && sessionData.prompts.length > 0) {
          const sessionPrompts = sessionData.prompts.map(prompt => ({
            _id: prompt._id,
            text: prompt.text,
            createdAt: prompt.createdAt || new Date().toISOString(),
            updatedAt: prompt.updatedAt,
            isActive: prompt.isActive || false
          }));
          setPromptHistory(sessionPrompts);
        }
      } catch (err) {
        console.error('Error refreshing prompt history:', err);
      }
    }
  };
  
  // Handle reset button click
  const handleReset = () => {
    setIsBuilderMode(false);
    setInputValue("");
    setInputFocused(false);
    setError(null);
  };
  
  // Clear error state
  const handleClearError = () => {
    setError(null);
  };
  
  // Handle selecting a prompt from history
  const handleSelectPrompt = async (prompt: PromptHistoryItem) => {
    // Store the selected prompt ID for reference
    const selectedPromptId = prompt._id;
    console.log('Selected prompt with ID:', selectedPromptId);
    
    setCurrentPrompt(prompt.text);
    
    // Update the active state in prompt history
    const updatedPromptHistory = promptHistory.map(p => ({
      ...p,
      isActive: p._id === selectedPromptId
    }));
    setPromptHistory(updatedPromptHistory);
    
    // Check if the prompt already has sections
    if (selectedPromptId && !selectedPromptId.startsWith('temp-')) {
      try {
        console.log('Fetching existing prompt data for:', selectedPromptId);
        const response = await fetch(`http://localhost:3001/api/prompts/${selectedPromptId}`);
        
        if (response.ok) {
          const promptData = await response.json();
          if (promptData && promptData.sections && promptData.sections.length > 0) {
            console.log('Using existing sections from saved prompt');
            // Add id to each section to match the Section interface
            const sectionsWithId = promptData.sections.map((section: { title: string; content: string }, index: number) => ({
              ...section,
              id: `section-${index}`
            }));
            setSections(sectionsWithId);
            return; // Don't regenerate sections
          }
        }
      } catch (error) {
        console.error('Error fetching prompt data:', error);
      }
    }
    
    // Fallback to generating sections if we couldn't get them from the saved prompt
    generateSectionsFromPrompt(prompt.text);
  };
  
  // Handle deleting a prompt
  const handleDeletePrompt = async (promptId: string): Promise<boolean> => {
    console.log('handleDeletePrompt called with ID:', promptId);
    
    try {
      // Find the prompt in history to show what we're deleting
      const promptToDelete = promptHistory.find(p => p._id === promptId);
      const isActivePrompt = promptToDelete?.isActive || promptToDelete?.text === currentPrompt;
      console.log('Deleting prompt:', promptToDelete?.text?.substring(0, 30), 'Active:', isActivePrompt);
      
      // Use the deletePrompt API function
      await deletePrompt(promptId);
      
      console.log('Delete API call successful');
      
      // Update the prompt history by removing the deleted prompt
      console.log('Updating prompt history after successful delete');
      const newHistory = promptHistory.filter(item => item._id !== promptId);
      
      // If the deleted prompt was the current one, handle the UI reset
      if (isActivePrompt) {
        console.log('Deleted the active prompt, resetting UI');
        
        // If there are other prompts in history, select the most recent one
        if (newHistory.length > 0) {
          // Sort by createdAt in descending order and select the first one
          const sortedPrompts = [...newHistory].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          console.log('Auto-selecting most recent prompt:', sortedPrompts[0].text.substring(0, 30));
          
          // Update the history with the new active prompt
          const updatedHistoryWithActive = sortedPrompts.map((p, index) => ({
            ...p,
            isActive: index === 0 // Make the first (most recent) prompt active
          }));
          
          setPromptHistory(updatedHistoryWithActive);
          setCurrentPrompt(sortedPrompts[0].text);
          
          // Load sections for the selected prompt
          try {
            console.log('Fetching existing prompt data for:', sortedPrompts[0]._id);
            const response = await fetch(`http://localhost:3001/api/prompts/${sortedPrompts[0]._id}`);
            
            if (response.ok) {
              const promptData = await response.json();
              if (promptData && promptData.sections && promptData.sections.length > 0) {
                console.log('Using existing sections from saved prompt');
                const sectionsWithId = promptData.sections.map((section: { title: string; content: string }, index: number) => ({
                  ...section,
                  id: `section-${index}`
                }));
                setSections(sectionsWithId);
              } else {
                // Generate sections if none exist
                generateSectionsFromPrompt(sortedPrompts[0].text);
              }
            } else {
              // Fallback to generating sections
              generateSectionsFromPrompt(sortedPrompts[0].text);
            }
          } catch (error) {
            console.error('Error fetching prompt data:', error);
            // Fallback to generating sections
            generateSectionsFromPrompt(sortedPrompts[0].text);
          }
        } else {
          // No prompts left, clear everything
          setPromptHistory([]);
          setCurrentPrompt('');
          setSections([]);
        }
      } else {
        // Just update the history without changing active prompt
        setPromptHistory(newHistory);
      }
      
      console.log('New history length:', newHistory.length, 'Old length:', promptHistory.length);
      return true;
    } catch (error) {
      console.error('Error deleting prompt:', error);
      setError('Failed to delete prompt. Please try again.');
      return false;
    }
  };

  return (
    <>
      {!isBuilderMode ? (
        // Home Screen
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex flex-col items-center justify-center p-4 fade-in">
          {/* Background blobs */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <div 
              className="absolute w-[500px] h-[500px] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl blob-animation-1"
              style={{ top: "10%", left: "10%" }}
            />
            <div
              className="absolute w-[400px] h-[400px] rounded-full bg-purple-200/30 dark:bg-purple-500/10 blur-3xl blob-animation-2"
              style={{ top: "40%", right: "15%" }}
            />
          </div>

          {/* Main content */}
          <div className="z-10 flex flex-col items-center max-w-3xl w-full fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Describe your website idea
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-10 max-w-lg">
              Type your idea and we&apos;ll generate website sections for you
            </p>

            {/* Prompt input box */}
            <form 
              className={`relative w-full max-w-2xl transition-all duration-300 ${inputFocused ? 'scale-105' : ''}`}
              onSubmit={handleSubmit}
            >
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-6 py-4 text-lg rounded-full border-2 border-purple-200 dark:border-purple-900/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 outline-none transition-all bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
                  placeholder={PROMPT_SUGGESTIONS[currentSuggestion]}
                  onFocus={handleFocus}
                  onChange={handleChange}
                  value={inputValue}
                  autoFocus
                />
              
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-full font-medium hover:from-purple-700 hover:to-blue-600 transition-all hover:scale-105 active:scale-95"
                >
                  Generate
                </button>
              </div>
            </form>

            {/* Cloud suggestions with fixed positions defined in CSS */}
            <div className="cloud-container">
              {PROMPT_SUGGESTIONS.map((suggestion, index) => {
                // Use one of 4 float animations
                const floatClass = `float-${(index % 4) + 1}`;
                
                // Handle click on suggestion to populate input field
                const handleSuggestionClick = () => {
                  setInputValue(suggestion);
                  setInputFocused(true);
                };
                
                return (
                  <div
                    key={`${suggestion}-${index}`}
                    className={`cloud-suggestion ${floatClass}`}
                    onClick={handleSuggestionClick}
                    role="button"
                    tabIndex={0}
                    aria-label={`Use suggestion: ${suggestion}`}
                  >
                    {suggestion}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // Builder Workspace
        <div className="w-full fade-in">
          <BuilderWorkspace
            prompt={currentPrompt}
            onPromptChange={handlePromptChange}
            isLoading={isLoading}
            sections={sections}
            promptHistory={promptHistory}
            onSelectPrompt={handleSelectPrompt}
            onDeletePrompt={handleDeletePrompt}
            error={error}
            onClearError={() => setError(null)}
            onReset={() => {
              setSections([]);
              setCurrentPrompt('');
            }}
          />
        </div>
      )}
    </>
  );
}
