"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";

// Types for our sections
export interface Section {
  id: string;
  title: string;
  content: string;
}

// Props for the BuilderWorkspace component
interface BuilderWorkspaceProps {
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  onRegenerate: () => void;
  onReset: () => void;
  isLoading: boolean;
  sections: Section[];
  promptHistory: string[];
  onSelectPrompt: (prompt: string) => void;
  error?: string;
  onClearError?: () => void;
}

export default function BuilderWorkspace({
  prompt,
  onPromptChange,
  onRegenerate,
  onReset,
  isLoading,
  sections,
  promptHistory,
  onSelectPrompt,
  error,
  onClearError,
}: BuilderWorkspaceProps) {
  const [newPrompt, setNewPrompt] = useState(prompt);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrompt.trim()) {
      onPromptChange(newPrompt);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header with title */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">Website Idea Generator</h1>
        <button 
          onClick={onReset}
          className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Start Over
        </button>
      </header>

      {/* Main content - split screen */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left section - Preview */}
        <div className="w-full md:w-2/3 p-6 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Preview: {prompt}
            </h2>
            
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Generating sections...</p>
                
                {/* Fake terminal loading log */}
                <motion.div 
                  className="w-full mt-6 bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.5 }}
                >
                  <p>{">"}  Analyzing prompt: "{prompt}"</p>
                  <p>{">"} Generating website structure...</p>
                  <p className="animate-pulse">{">"} Processing sections...</p>
                </motion.div>
              </div>
            )}

            {/* Sections */}
            <AnimatePresence>
              {!isLoading && sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold mb-3 text-purple-600 dark:text-purple-400">{section.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{section.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Error state */}
            {error && (
              <ErrorMessage 
                message={error} 
                onRetry={() => {
                  if (onClearError) onClearError();
                  onRegenerate();
                }} 
              />
            )}
            
            {/* No sections state */}
            {!isLoading && sections.length === 0 && !error && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No sections generated yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right section - History + Controls */}
        <div className="w-full md:w-1/3 bg-gray-100 dark:bg-gray-800 p-6 flex flex-col">
          {/* Prompt history */}
          <div className="mb-6 flex-1 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Prompt History</h3>
            
            {promptHistory.length > 0 ? (
              <div className="space-y-2">
                {promptHistory.map((historyPrompt, index) => (
                  <motion.button
                    key={index}
                    className={`w-full text-left p-3 rounded-md text-sm ${
                      historyPrompt === prompt
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => onSelectPrompt(historyPrompt)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    {historyPrompt}
                  </motion.button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No history yet</p>
            )}
          </div>

          {/* Prompt input area */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Update Prompt</h3>
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 focus:border-purple-500 outline-none transition-all mb-3"
                rows={3}
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Describe your website idea..."
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={onRegenerate}
                  disabled={isLoading}
                  className={`flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Regenerate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
