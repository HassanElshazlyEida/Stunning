"use client";

import React from 'react';
import { FiShare2 } from 'react-icons/fi';

interface HeaderProps {
  onShareContent: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShareContent }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-3 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Stunning.io</h1>
      </div>
      
      {/* Share button in header */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onShareContent}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
          title="Share all sections"
        >
          <FiShare2 className="w-4 h-4" /> Share
        </button>
      </div>
    </header>
  );
};

export default Header;
