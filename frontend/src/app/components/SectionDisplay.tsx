"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiCopy } from 'react-icons/fi';
import ErrorMessage from './ErrorMessage';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface SectionDisplayProps {
  sections: Section[];
  viewMode: 'sections' | 'preview';
  isLoading: boolean;
  error: string | null;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  previewHeight: number;
  handleResizeStart: (e: React.MouseEvent) => void;
  handleCopySection: (content: string, title: string) => void;
}

const SectionDisplay: React.FC<SectionDisplayProps> = ({
  sections,
  viewMode,
  isLoading,
  error,
  isFullScreen,
  toggleFullScreen,
  previewHeight,
  handleResizeStart,
  handleCopySection
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Generating your website sections...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <ErrorMessage 
          message={error} 
          onRetry={() => {}} 
        />
      </div>
    );
  }

  // No sections state
  if (!isLoading && sections.length === 0 && !error) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-purple-500 dark:text-purple-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No Sections Generated Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Enter a prompt below to generate website sections based on your idea.</p>
          <div className="text-sm text-gray-500 dark:text-gray-500 bg-white dark:bg-gray-800 p-3 rounded-lg inline-block">
            <span className="font-medium">Example:</span> &ldquo;Create a portfolio website for a photographer&rdquo;
          </div>
        </div>
      </div>
    );
  }

  // Section mode view
  if (viewMode === 'sections') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-50 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{section.title}</h3>
                <button 
                  onClick={() => handleCopySection(section.content, section.title)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  title="Copy section"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 overflow-auto max-h-[500px] custom-scrollbar">
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Preview mode view
  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-gray-900/90 p-4 flex items-center justify-center' : 'max-w-4xl mx-auto'}`}>
      {sections.length > 0 && (
        <motion.div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden ${isFullScreen ? 'w-full max-w-6xl h-[90vh]' : 'w-full'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Website preview header */}
          <div className="bg-gray-100 dark:bg-gray-700 p-2 border-b border-gray-200 dark:border-gray-600 flex items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex-1 text-center">
              Preview
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleFullScreen}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
              >
                {isFullScreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Combined sections content */}
          <div 
            className="website-preview overflow-auto" 
            style={{ height: isFullScreen ? 'calc(90vh - 40px)' : `${previewHeight}px` }}
          >
            {sections.map((section) => (
              <div key={section.id} dangerouslySetInnerHTML={{ __html: section.content }} />
            ))}
          </div>
          
          {/* Resize handle */}
          {!isFullScreen && (
            <div 
              className="h-2 bg-gray-100 dark:bg-gray-700 cursor-ns-resize flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onMouseDown={handleResizeStart}
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Close button for full screen mode */}
      {isFullScreen && (
        <button 
          onClick={toggleFullScreen}
          className="fixed top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};



export default SectionDisplay;
