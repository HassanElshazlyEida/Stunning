"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BuilderWorkspace, { Section } from "./components/BuilderWorkspace";
import { generateSections, getPromptHistory, checkSessionPrompts } from "./services/api";

// Sample prompt suggestions
const PROMPT_SUGGESTIONS = [
  "Build E-commerce website",
  "Design a personal portfolio",
  "Launch a SaaS landing page",
  "Create a blog website",
  "Build a restaurant website",
  "Design a travel agency site",
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
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  
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
        // This will return both the existence flag and the session prompts
        const sessionData = await checkSessionPrompts();
        
        // If prompts exist for this session, switch to builder mode
        if (sessionData.hasPrompts && sessionData.prompts.length > 0) {
          console.log('Found existing prompts for this session, switching to builder mode');
          setIsBuilderMode(true);
          
          // Use the session prompts directly instead of making another API call
          const sessionPrompts = sessionData.prompts.map(prompt => prompt.text);
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
        console.error('Failed to initialize app:', err);
        // Don't show error for this as it's not critical
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
      
      // Add to history if not already there
      if (!promptHistory.includes(inputValue)) {
        setPromptHistory(prev => [inputValue, ...prev]);
      }
    }
  };
  
  // Generate sections from a prompt
  const generateSectionsFromPrompt = async (prompt: string) => {
    setIsLoading(true);
    setError(undefined); // Clear any previous errors
    
    try {
      // The generateSections function now handles sending the session ID to the backend
      // so we don't need a separate call to savePromptAndSections
      const response = await generateSections(prompt);
      setSections(response.sections);
      
      // Store in localStorage for offline access
      try {
        localStorage.setItem('lastPrompt', prompt);
        localStorage.setItem('lastSections', JSON.stringify(response.sections));
        localStorage.setItem('lastUpdated', new Date().toISOString());
      } catch (storageError) {
        console.warn('Could not save to localStorage:', storageError);
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
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle prompt change in builder mode
  const handlePromptChange = (newPrompt: string) => {
    // Only generate sections if the prompt has actually changed
    if (newPrompt !== currentPrompt) {
      setCurrentPrompt(newPrompt);
      generateSectionsFromPrompt(newPrompt);
      
      // Add to history if not already there
      if (!promptHistory.includes(newPrompt)) {
        setPromptHistory(prev => [newPrompt, ...prev]);
      }
    }
  };
  
  // Handle regenerate button click
  const handleRegenerate = () => {
    generateSectionsFromPrompt(currentPrompt);
  };
  
  // Handle reset button click
  const handleReset = () => {
    setIsBuilderMode(false);
    setInputValue("");
    setInputFocused(false);
    setError(undefined);
  };
  
  // Clear error state
  const handleClearError = () => {
    setError(undefined);
  };
  
  // Handle selecting a prompt from history
  const handleSelectPrompt = (prompt: string) => {
    setCurrentPrompt(prompt);
    generateSectionsFromPrompt(prompt);
  };

  return (
    <AnimatePresence mode="wait">
      {!isBuilderMode ? (
        // Home Screen
        <motion.div 
          key="home"
          className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex flex-col items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated background blobs */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 20,
                ease: "easeInOut",
              }}
              style={{ top: "10%", left: "10%" }}
            />
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full bg-purple-200/30 dark:bg-purple-500/10 blur-3xl"
              animate={{
                x: [0, -70, 0],
                y: [0, 100, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 25,
                ease: "easeInOut",
              }}
              style={{ top: "40%", right: "15%" }}
            />
          </div>

          {/* Main content */}
          <motion.div 
            className="z-10 flex flex-col items-center max-w-3xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Describe your website idea
            </motion.h1>

            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 text-center mb-10 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Type your idea and we'll generate website sections for you
            </motion.p>

            {/* Prompt input box */}
            <motion.form 
              className={`relative w-full max-w-2xl transition-all duration-300 ${inputFocused ? 'scale-105' : ''}`}
              onSubmit={handleSubmit}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
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
                <AnimatePresence>
                  {!inputFocused && (
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.span 
                        className="text-gray-400 dark:text-gray-500"
                        key={currentSuggestion}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {PROMPT_SUGGESTIONS[currentSuggestion]}
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-full font-medium hover:from-purple-700 hover:to-blue-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Generate
                </motion.button>
              </div>
            </motion.form>

            {/* Flying suggestions */}
            <div className="mt-16 relative w-full max-w-2xl h-20">
              <AnimatePresence>
                {PROMPT_SUGGESTIONS.map((suggestion, index) => {
                  // Only show 3 suggestions at a time
                  if ((index + currentSuggestion) % PROMPT_SUGGESTIONS.length >= 3) return null;
                  
                  const position = (index + currentSuggestion) % PROMPT_SUGGESTIONS.length;
                  const xPositions = [-200, 0, 200];
                  
                  return (
                    <motion.div
                      key={`${suggestion}-${position}`}
                      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md backdrop-blur-sm text-sm"
                      initial={{ opacity: 0, x: xPositions[position] - 300, y: 0 }}
                      animate={{ opacity: position === 1 ? 1 : 0.7, x: xPositions[position], y: 0 }}
                      exit={{ opacity: 0, x: xPositions[position] + 300 }}
                      transition={{ duration: 0.5 }}
                    >
                      {suggestion}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        // Builder Workspace
        <motion.div
          key="builder"
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BuilderWorkspace
            prompt={currentPrompt}
            onPromptChange={handlePromptChange}
            onRegenerate={handleRegenerate}
            onReset={handleReset}
            isLoading={isLoading}
            sections={sections}
            promptHistory={promptHistory}
            onSelectPrompt={handleSelectPrompt}
            error={error}
            onClearError={handleClearError}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
