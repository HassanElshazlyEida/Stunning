"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiMoreVertical, FiTrash2, FiShare2, FiX } from 'react-icons/fi';
import { PromptHistoryItem } from '../services/api';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  promptHistory: PromptHistoryItem[];
  onSelectPrompt: (prompt: PromptHistoryItem) => void;
  activeMenuIndex: number | null;
  setActiveMenuIndex: (index: number | null) => void;
  deleteStatus: { id: string; status: 'deleting' | 'success' | 'error' | null };
  setDeleteConfirmation: (confirmation: { show: boolean; promptId: string; promptText: string }) => void;
  formatDate: (dateString: string) => string;
  handleShare: (sections: any[]) => void;
  sections: any[];
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  promptHistory,
  onSelectPrompt,
  activeMenuIndex,
  setActiveMenuIndex,
  deleteStatus,
  setDeleteConfirmation,
  formatDate,
  handleShare,
  sections
}) => {
  return (
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
                <FiArrowLeft className="w-4 h-4" />
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
                              // Call the parent component's onSelectPrompt function
                              // This will set isActive in the promptHistory array
                              onSelectPrompt(historyPrompt);
                              
                              // Close any open menu
                              setActiveMenuIndex(null);
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
                              <div 
                                className="dropdown-menu absolute right-0 top-8 w-36 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                                onClick={(e) => {
                                  // Prevent clicks inside dropdown from closing the dropdown
                                  e.stopPropagation();
                                }}
                              >
                                {/* Delete option */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    // Show delete confirmation popup instead of deleting immediately
                                    if (historyPrompt._id) {
                                      setDeleteConfirmation({
                                        show: true,
                                        promptId: historyPrompt._id,
                                        promptText: historyPrompt.text.substring(0, 30) + (historyPrompt.text.length > 30 ? '...' : '')
                                      });
                                      // Don't close menu until after action is complete
                                      setTimeout(() => {
                                        setActiveMenuIndex(null);
                                      }, 100);
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
                                    e.preventDefault();
                                    handleShare(sections);
                                    // Don't close menu until after action is complete
                                    setTimeout(() => {
                                      setActiveMenuIndex(null);
                                    }, 100);
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
  );
};

export default Sidebar;
