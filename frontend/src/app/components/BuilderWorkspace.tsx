"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShare2, FiChevronLeft, FiChevronRight, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import { PromptHistoryItem } from '../services/api';
import Link from 'next/link';
import ErrorMessage from './ErrorMessage';

// Types for our sections
export interface Section {
  id: string;
  title: string;
  content: string;
}

// Type for prompt with timestamp
export interface PromptWithTime {
  text: string;
  createdAt: string;
  updatedAt?: string;
}

// Props for the BuilderWorkspace component
interface BuilderWorkspaceProps {
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  onReset: () => void;
  isLoading: boolean;
  sections: Section[];
  promptHistory: PromptHistoryItem[];
  onSelectPrompt: (prompt: PromptHistoryItem) => void;
  onDeletePrompt?: (promptId: string) => Promise<boolean>;
  error?: string;
  onClearError?: () => void;
}

export default function BuilderWorkspace({
  prompt,
  onPromptChange,
  onReset,
  isLoading,
  sections,
  promptHistory,
  onSelectPrompt,
  onDeletePrompt,
  error,
  onClearError,
}: BuilderWorkspaceProps) {
  const [newPrompt, setNewPrompt] = useState(prompt);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<{id: string, status: 'deleting' | 'success' | 'error' | null}>({id: '', status: null});
  const [deleteConfirmation, setDeleteConfirmation] = useState<{show: boolean, promptId: string, promptText: string}>({show: false, promptId: '', promptText: ''});
  
  // Create a ref for the textarea to focus it when needed
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrompt.trim()) {
      onPromptChange(newPrompt);
    }
  };
  
  // Effect to update newPrompt when prompt prop changes (e.g., when selecting from history)
  useEffect(() => {
    setNewPrompt(prompt);
    // Focus the textarea when prompt changes
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  }, [prompt]);
  
  // Share all sections (copy to clipboard with better UX)
  const shareContent = () => {
    const allSectionsContent = sections.map(section => {
      return `# ${section.title}\n${section.content}`;
    }).join('\n\n');
    
    navigator.clipboard.writeText(allSectionsContent)
      .then(() => {
        // Show toast notification instead of alert
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  // Format date from ISO string without date-fns
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (e) {
      return 'Just now';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header with title - ChatGPT-like */}
      <header className="bg-white dark:bg-gray-900 shadow-sm py-3 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Stunning.io</h1>
        </div>
        
        {/* Share button in header */}
        <div className="flex items-center gap-2">
          <button 
            onClick={shareContent}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
            title="Share all sections"
          >
            <FiShare2 className="w-4 h-4" /> Share
          </button>
        </div>
        
        {/* Share toast notification */}
        {showShareToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Content copied to clipboard!
          </motion.div>
        )}
        
        {/* Delete toast notification */}
        {showDeleteToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Prompt deleted successfully!
          </motion.div>
        )}
      </header>

      {/* Main content - ChatGPT-like layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar toggle button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute fixed top-15 left-0 z-10 bg-white dark:bg-gray-800 shadow-md rounded-r-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <FiChevronLeft className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
        </button>

        {/* Sidebar - History */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '260px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-screen fixed left-0 top-0 pt-16 pb-36 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-20 flex flex-col"
            >
              <div className="p-2 flex-1 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Chat</h2>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                    aria-label="Collapse sidebar"
                    title="Collapse sidebar"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  {promptHistory.length > 0 ? (
                    <div className="w-full">
                      {promptHistory.map((historyPrompt, index) => {
                        const isDeleting = deleteStatus.id === historyPrompt._id && deleteStatus.status === 'deleting';
                        return (
                          <div 
                            key={`history-${index}`}
                            className={`group relative w-full text-left py-3 px-3 border-b border-gray-100 dark:border-gray-800 ${historyPrompt.isActive
                              ? 'bg-gray-100 dark:bg-gray-800'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            } ${isDeleting ? 'opacity-50' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                              <button
                                onClick={() => {
                                  onSelectPrompt(historyPrompt);
                                  // Focus will be handled by the useEffect that watches for prompt changes
                                }}
                                className="text-left flex-1 overflow-hidden"
                                disabled={isDeleting}
                              >
                                <div className="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-1">
                                  {historyPrompt.text.length > 30
                                    ? `${historyPrompt.text.substring(0, 30)}...`
                                    : historyPrompt.text
                                  }
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {formatDate(historyPrompt.createdAt)}
                                </div>
                              </button>
                              
                              {/* Three-dot menu with options */}
                              <div className="relative">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuIndex(activeMenuIndex === index ? null : index);
                                  }}
                                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                                  title="Options"
                                  disabled={isDeleting}
                                >
                                  <FiMoreVertical className="w-4 h-4" />
                                </button>
                                
                                {/* Dropdown menu */}
                                {activeMenuIndex === index && (
                                  <div className="absolute right-0 top-8 w-36 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                                    {/* Delete option */}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuIndex(null);
                                        // Show delete confirmation popup instead of deleting immediately
                                        if (historyPrompt._id) {
                                          setDeleteConfirmation({
                                            show: true,
                                            promptId: historyPrompt._id,
                                            promptText: historyPrompt.text.substring(0, 30) + (historyPrompt.text.length > 30 ? '...' : '')
                                          });
                                        }
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 dark:text-red-400"
                                    >
                                      <FiTrash2 className="w-4 h-4" /> Delete
                                    </button>
                                    
                                    {/* Share option */}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuIndex(null);
                                        // Get the sections for this prompt if available, otherwise share the prompt text
                                        let contentToShare = '';
                                        contentToShare = sections.map(section => 
                                          `${section.title}\n${section.content}\n\n`
                                        ).join('');
                                        navigator.clipboard.writeText(contentToShare);
                                        setShowShareToast(true);
                                        setTimeout(() => setShowShareToast(false), 3000);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 dark:text-blue-400"
                                    >
                                      <FiShare2 className="w-4 h-4" /> Share
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto mb-2 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                      <p>No prompt history yet</p>
                      <p className="text-xs mt-1">Your prompts will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content area - ChatGPT-like */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Sections display area - with bottom margin to prevent content from being hidden under input */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6" style={{ marginBottom: '180px' }}>
            
            {/* Loading state - Enhanced */}
            {isLoading && (
              <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 dark:border-gray-700 dark:border-t-purple-400 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full"></div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">Generating website sections...</p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-500">This may take a few moments</div>
              </div>
            )}

            {/* Sections - ChatGPT style with enhanced HTML tag rendering */}
            <div className="max-w-3xl mx-auto space-y-8">
              {!isLoading && sections.map((section, index) => {
                
                return (
                  <motion.div
                    key={section.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                  >
                    <div className="flex items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mr-3">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{section.title}</h3>
                    </div>
                    {/* Section content with actual HTML rendering */}
                    <div className="text-gray-700 dark:text-gray-300 max-w-none overflow-hidden">
                      {/* Remove the extra div wrapper to avoid interfering with Tailwind styles */}
                      <div dangerouslySetInnerHTML={{ __html: section.content }} className="w-full" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Error state */}
            {error && (
              <div className="max-w-3xl mx-auto">
                <ErrorMessage 
                  message={error} 
                  onRetry={() => {
                    if (onClearError) onClearError();
                  }} 
                />
              </div>
            )}
            
            {/* No sections state - Enhanced */}
            {!isLoading && sections.length === 0 && !error && (
              <div className="max-w-3xl mx-auto text-center py-12">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-purple-500 dark:text-purple-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No Sections Generated Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Enter a prompt below to generate website sections based on your idea.</p>
                  <div className="text-sm text-gray-500 dark:text-gray-500 bg-white dark:bg-gray-800 p-3 rounded-lg inline-block">
                    <span className="font-medium">Example:</span> "Create a portfolio website for a photographer"
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area - ChatGPT style */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-3 border-t border-gray-200 dark:border-gray-700 z-30" style={{ maxHeight: '170px' }}>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="relative flex items-end rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                <textarea
                  ref={textareaRef}
                  className="w-full p-3 pr-16 bg-transparent text-gray-700 dark:text-gray-200 outline-none resize-none min-h-[56px] max-h-[200px] custom-scrollbar"
                  rows={3}
                  value={newPrompt}
                  onChange={(e) => {
                    setNewPrompt(e.target.value);
                    // Auto-resize the textarea based on content
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
                  }}
                  placeholder="Describe your website idea..."
                  disabled={isLoading}
                  style={{overflowY: 'auto'}}
                  onFocus={(e) => {
                    // Ensure proper height on focus
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !newPrompt.trim()}
                  className="absolute right-2 bottom-2 p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Generate"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Your website sections will be generated based on your prompt.
              </p>
            </form>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation popup */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Delete Prompt</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Are you sure you want to delete this prompt?</p>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md mb-4">
              <p className="text-gray-800 dark:text-gray-200 font-medium">"{deleteConfirmation.promptText}"</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmation({show: false, promptId: '', promptText: ''})}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (onDeletePrompt && deleteConfirmation.promptId) {
                    setDeleteStatus({id: deleteConfirmation.promptId, status: 'deleting'});
                    setDeleteConfirmation({show: false, promptId: '', promptText: ''});
                    
                    const success = await onDeletePrompt(deleteConfirmation.promptId);
                    
                    if (success) {
                      setDeleteStatus({id: deleteConfirmation.promptId, status: 'success'});
                      // Show toast notification
                      setShowDeleteToast(true);
                      // Clear status and hide toast after a short delay
                      setTimeout(() => {
                        setDeleteStatus({id: '', status: null});
                        setShowDeleteToast(false);
                      }, 3000);
                    } else {
                      setDeleteStatus({id: deleteConfirmation.promptId, status: 'error'});
                      setTimeout(() => setDeleteStatus({id: '', status: null}), 2000);
                    }
                  }
                }}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
