"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FiMenu } from 'react-icons/fi';
import { PromptHistoryItem } from '../services/api';

// Import modular components
import Header from './Header';
import Sidebar from './Sidebar';
import SectionDisplay from './SectionDisplay';
import PromptInput from './PromptInput';
import Toast from './Toast';
import DeleteConfirmationModal from './DeleteConfirmationModal';

// Define Section interface
export interface Section {
  id: string;
  title: string;
  content: string;
}

// Props for the BuilderWorkspace component
interface BuilderWorkspaceProps {
  // Controlled mode props
  prompt: string;
  onPromptChange: (prompt: string) => void;
  isLoading: boolean;
  sections: Section[];
  promptHistory: PromptHistoryItem[];
  onSelectPrompt: (selectedPrompt: PromptHistoryItem) => void;
  onDeletePrompt: (promptId: string) => Promise<boolean>;
  error: string | null;
  onClearError: () => void;
  onReset: () => void;
}

const BuilderWorkspace: React.FC<BuilderWorkspaceProps> = ({
  prompt,
  onPromptChange,
  onReset,
  isLoading,
  sections,
  promptHistory,
  onSelectPrompt,
  onDeletePrompt,
  error,
  onClearError
}) => {
  // State for prompt input
  const [newPrompt, setNewPrompt] = useState<string>(prompt || '');
  
  // Sync newPrompt with external prompt when it changes
  useEffect(() => {
    if (prompt !== undefined) {
      setNewPrompt(prompt);
      
      // Focus the textarea when prompt changes
      if (textareaRef.current) {
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      }
    }
  }, [prompt]);
  
  // Update sidebar when promptHistory changes
  useEffect(() => {
    // Close any open menus when prompt history changes
    // This ensures the sidebar is properly updated
    setActiveMenuIndex(null);
  }, [promptHistory]);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'sections' | 'preview'>('sections');
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [previewHeight, setPreviewHeight] = useState(600);
  
  // Toast notifications
  const [showShareToast, setShowShareToast] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [copiedSection, setCopiedSection] = useState('');
  
  // Delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    promptId: '',
    promptText: ''
  });
  const [deleteStatus, setDeleteStatus] = useState<{
    id: string;
    status: 'deleting' | 'success' | 'error' | null;
  }>({
    id: '',
    status: null
  });
  
  const [errorState, setErrorState] = useState<string | null>(null); // Local error state

  // Refs for resize functionality
  const resizeStartPosRef = useRef(0);
  const startHeightRef = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Create a ref for the textarea to focus it when needed
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Effect to handle click outside of dropdown menu
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle click outside of dropdown menu
  const handleClickOutside = (event: MouseEvent) => {
    // Check if the click was inside a dropdown menu
    const target = event.target as Node;
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    
    // If we clicked on a dropdown menu or its children, don't close it
    for (const menu of Array.from(dropdownMenus)) {
      if (menu.contains(target)) {
        return;
      }
    }
    
    // Otherwise, close any open dropdown
    setActiveMenuIndex(null);
  };

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Clear error
  const handleClearError = () => {
    setErrorState(null);
    if (onClearError) {
      onClearError();
    }
  };
  
  // Handle reset (clear sections)
  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  // Handle resize start for preview pane
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeStartPosRef.current = e.clientY;
    startHeightRef.current = previewHeight;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - resizeStartPosRef.current;
      setPreviewHeight(Math.max(300, Math.min(800, startHeightRef.current + delta)));
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Toggle full screen preview
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | string) => {
    if (typeof e === 'object') {
      e.preventDefault();
    }
    
    const promptText = typeof e === 'string' ? e : newPrompt;
    
    if (promptText.trim()) {
      // Pass the prompt text to the parent component to generate sections
      // This will also update the prompt history in the parent component
      onPromptChange(promptText);
      
      // Clear input after submission for better UX
      setNewPrompt(''); 
      
      // Close any open menu
      setActiveMenuIndex(null);
      
      // Focus back on the textarea for continuous input
      if (textareaRef.current) {
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      }
    }
  };

  // Handle selecting a prompt from history
  const handleSelectPrompt = (selectedPrompt: PromptHistoryItem) => {
    // Call the parent component's onSelectPrompt function to load the selected prompt
    // This will update the prompt history with isActive flags in the parent component
    onSelectPrompt(selectedPrompt);
    
    // Update the local prompt state to match the selected prompt
    setNewPrompt(selectedPrompt.text);
    
    // Close any open menu
    setActiveMenuIndex(null);
  };

  // Handle showing delete confirmation
  const handleShowDeleteConfirmation = (promptId: string, promptText: string) => {
    setDeleteConfirmation({
      show: true,
      promptId,
      promptText
    });
  };

  // Handle deleting a prompt
  const handleDeletePrompt = async (promptId: string) => {
    setDeleteStatus({
      id: promptId,
      status: 'deleting'
    });
    
    try {
      if (onDeletePrompt) {
        // Call the parent's onDeletePrompt function
        const success = await onDeletePrompt(promptId);
        
        if (success) {
          // Show success toast
          setShowDeleteToast(true);
          setTimeout(() => setShowDeleteToast(false), 3000);
          
          // Update delete status
          setDeleteStatus({
            id: promptId,
            status: 'success'
          });
          
          // Close any open menu after successful deletion
          setActiveMenuIndex(null);
          
          // Clear the input field if the deleted prompt was active
          const wasActivePrompt = promptHistory.find(p => p._id === promptId)?.isActive;
          if (wasActivePrompt) {
            setNewPrompt('');
          }
        } else {
          setDeleteStatus({
            id: promptId,
            status: 'error'
          });
        }
        
        return success;
      }
      return false;
    } catch (err) {
      console.error('Error deleting prompt:', err);
      setDeleteStatus({
        id: promptId,
        status: 'error'
      });
      return false;
    }
  };

  // Handle copying section to clipboard
  const copySection = (content: string, title: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopiedSection(title);
        setShowCopyToast(true);
        setTimeout(() => {
          setShowCopyToast(false);
        }, 3000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  // Handle sharing all sections
  const handleShare = () => {
    const allSections = sections.map(section => {
      return `# ${section.title}\n\n${section.content}`;
    }).join('\n\n');
    
    navigator.clipboard.writeText(allSections)
      .then(() => {
        setShowShareToast(true);
        setTimeout(() => {
          setShowShareToast(false);
        }, 3000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header - fixed at the top with higher z-index */}
      <div className="fixed top-0 left-0 right-0 z-30 dark:bg-gray-900">
        <Header onShareContent={handleShare} />
      </div>
      
      {/* Toast notifications */}
      <Toast 
        message="All sections copied to clipboard!" 
        type="success" 
        isVisible={showShareToast} 
      />
      
      {showCopyToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-up">
          <p>Copied {copiedSection} to clipboard!</p>
        </div>
      )}
      
      <Toast 
        message="Prompt deleted successfully" 
        type="success" 
        isVisible={showDeleteToast} 
      />
      
      {/* Main content container - add top margin to account for fixed header */}
      <div className="flex min-h-[calc(100vh-60px)] mt-16 dark:bg-gray-900 ">
        {/* Sidebar with prompt history - adjust z-index to be below header but above content */}
        <div className="relative z-20 w-[260px] ">
          <Sidebar 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            promptHistory={promptHistory}
            onSelectPrompt={handleSelectPrompt}
            activeMenuIndex={activeMenuIndex}
            setActiveMenuIndex={setActiveMenuIndex}
            deleteStatus={deleteStatus}
            setDeleteConfirmation={setDeleteConfirmation}
            formatDate={formatDate}
            handleShare={handleShare}
            sections={sections}
          />
        </div>
        
        {/* Main content area - no need for top padding since we have margin on the container */}
        <div className="flex-1 ">
          {/* Top bar with toggle buttons - adjust left position based on sidebar state */}
          <div className={`fixed top-15 ${sidebarOpen ? 'md:left-[260px]' : 'left-0'} right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-20 px-4 py-2 flex items-center transition-all duration-300`}>
            {/* Sidebar toggle */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <FiMenu className="w-5 h-5" />
            </button>
            
            {/* View mode toggle */}
            <div className="ml-auto flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1">
              <button
                onClick={() => setViewMode('sections')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'sections'
                    ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Sections
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Preview
              </button>
            </div>
          </div>
          
          {/* Main content - add significant bottom padding to prevent footer overlap */}
          <div className="px-4 pt-16 pb-40 dark:bg-gray-900">
            <SectionDisplay 
              sections={sections}
              viewMode={viewMode}
              isLoading={isLoading}
              error={error}
              isFullScreen={isFullScreen}
              toggleFullScreen={toggleFullScreen}
              previewHeight={previewHeight}
              handleResizeStart={handleResizeStart}
              handleCopySection={copySection}
            />
          </div>
          
          {/* Input area - fixed at the bottom */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-3xl mx-auto px-4">
              <PromptInput 
                prompt={newPrompt}
                onPromptChange={setNewPrompt}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation popup */}
      <DeleteConfirmationModal 
        show={deleteConfirmation.show}
        promptId={deleteConfirmation.promptId}
        promptText={deleteConfirmation.promptText}
        onCancel={() => setDeleteConfirmation({show: false, promptId: '', promptText: ''})}
        onDelete={handleDeletePrompt}
        setDeleteStatus={setDeleteStatus}
        setShowDeleteToast={setShowDeleteToast}
      />
    </div>
  );
};

export default BuilderWorkspace;
