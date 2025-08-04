"use client";

import React from 'react';

interface DeleteConfirmationModalProps {
  show: boolean;
  promptId: string;
  promptText: string;
  onCancel: () => void;
  onDelete: (promptId: string) => Promise<boolean>;
  setDeleteStatus: (status: { id: string; status: 'deleting' | 'success' | 'error' | null }) => void;
  setShowDeleteToast: (show: boolean) => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  promptId,
  promptText,
  onCancel,
  onDelete,
  setDeleteStatus,
  setShowDeleteToast
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Delete Prompt</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Are you sure you want to delete this prompt?</p>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md mb-4">
          <p className="text-gray-800 dark:text-gray-200 font-medium">&ldquo;{promptText}&rdquo;</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (promptId) {
                setDeleteStatus({id: promptId, status: 'deleting'});
                onCancel(); // Close the modal
                
                const success = await onDelete(promptId);
                
                if (success) {
                  setDeleteStatus({id: promptId, status: 'success'});
                  // Show toast notification
                  setShowDeleteToast(true);
                  // Clear status and hide toast after a short delay
                  setTimeout(() => {
                    setDeleteStatus({id: '', status: null});
                    setShowDeleteToast(false);
                  }, 3000);
                } else {
                  setDeleteStatus({id: promptId, status: 'error'});
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
  );
};

export default DeleteConfirmationModal;
