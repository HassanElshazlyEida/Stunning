"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  
  // Rotate through suggestions every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % PROMPT_SUGGESTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle input focus
  const handleFocus = () => setInputFocused(true);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Will implement in Phase 3
      console.log("Submitted:", inputValue);  
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 flex flex-col items-center justify-center p-4">
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
    </div>
  );
}
