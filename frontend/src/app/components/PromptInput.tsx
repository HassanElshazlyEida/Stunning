"use client";

import React, { useRef, useEffect } from 'react';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  isLoading: boolean;
  onSubmit: (prompt: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onPromptChange,
  isLoading,
  onSubmit
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea when content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [prompt]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-3 border-t border-gray-200 dark:border-gray-700 z-30" style={{ maxHeight: '170px' }}>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(prompt);
      }} className="max-w-3xl mx-auto">
        <div className="relative flex items-end rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
          <textarea
            ref={textareaRef}
            className="w-full p-3 pr-16 bg-transparent text-gray-700 dark:text-gray-200 outline-none resize-none min-h-[56px] max-h-[200px] custom-scrollbar"
            rows={3}
            value={prompt}
            onChange={(e) => {
              onPromptChange(e.target.value);
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
            disabled={isLoading || !prompt.trim()}
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
  );
};

export default PromptInput;
