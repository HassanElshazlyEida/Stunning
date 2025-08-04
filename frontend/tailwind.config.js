module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Layout classes
    'container', 'mx-auto', 'flex', 'flex-col', 'flex-row', 'items-center', 'items-start', 'items-end',
    'justify-between', 'justify-center', 'justify-start', 'justify-end', 'space-x-2', 'space-x-4', 'space-x-6', 'space-y-2', 'space-y-4',
    'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'gap-2', 'gap-4', 'gap-6', 'gap-8',
    'hidden', 'block', 'inline-block', 'relative', 'absolute', 'inset-0',
    
    // Responsive variants
    'md:flex', 'md:hidden', 'md:flex-row', 'md:flex-col', 'md:w-1/2', 'md:w-1/3', 'md:w-2/3',
    'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4', 'md:text-xl', 'md:text-2xl', 'md:text-5xl', 'md:mb-0', 'md:mt-0',
    
    // Typography
    'text-center', 'text-left', 'text-right', 'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl',
    'font-bold', 'font-semibold', 'font-medium', 'font-normal',
    
    // Spacing
    'p-2', 'p-3', 'p-4', 'p-6', 'p-8',
    'px-2', 'px-3', 'px-4', 'px-6', 'px-8',
    'py-2', 'py-3', 'py-4', 'py-6', 'py-8', 'py-12', 'py-16', 'py-20',
    'pt-2', 'pt-4', 'pt-6', 'pt-8', 'pt-10',
    'pb-2', 'pb-4', 'pb-6', 'pb-8', 'pb-10',
    'pl-2', 'pl-4', 'pr-2', 'pr-4',
    'mb-2', 'mb-4', 'mb-6', 'mb-8', 'mb-12',
    'mt-2', 'mt-4', 'mt-6', 'mt-8', 'mt-10',
    'ml-2', 'ml-4', 'mr-2', 'mr-4',
    'my-2', 'my-4', 'my-6', 'my-8', 'my-10',
    'mx-2', 'mx-4', 'mx-6', 'mx-8', 'mx-auto',
    
    // Sizing
    'w-4', 'w-6', 'w-8', 'w-16', 'w-24', 'w-32', 'w-full', 'w-auto',
    'h-1', 'h-4', 'h-6', 'h-8', 'h-16', 'h-24', 'h-32', 'h-48', 'h-64', 'h-full', 'h-auto',
    'max-w-xs', 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-5xl', 'max-w-6xl',
    
    // Colors - Background
    'bg-white', 'bg-black', 'bg-transparent',
    'bg-amber-50', 'bg-amber-100', 'bg-amber-200', 'bg-amber-300', 'bg-amber-400', 'bg-amber-500', 'bg-amber-600', 'bg-amber-700', 'bg-amber-800', 'bg-amber-900',
    'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
    'bg-opacity-0', 'bg-opacity-25', 'bg-opacity-50', 'bg-opacity-75', 'bg-opacity-80', 'bg-opacity-90', 'bg-opacity-100',
    
    // Colors - Text
    'text-white', 'text-black',
    'text-amber-50', 'text-amber-100', 'text-amber-200', 'text-amber-300', 'text-amber-400', 'text-amber-500', 'text-amber-600', 'text-amber-700', 'text-amber-800', 'text-amber-900',
    'text-gray-50', 'text-gray-100', 'text-gray-200', 'text-gray-300', 'text-gray-400', 'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900',
    
    // Borders
    'border', 'border-0', 'border-2', 'border-4', 'border-t', 'border-b', 'border-l', 'border-r',
    'border-white', 'border-black', 'border-transparent',
    'border-amber-50', 'border-amber-100', 'border-amber-200', 'border-amber-300', 'border-amber-400', 'border-amber-500', 'border-amber-600', 'border-amber-700', 'border-amber-800', 'border-amber-900',
    'border-gray-50', 'border-gray-100', 'border-gray-200', 'border-gray-300', 'border-gray-400', 'border-gray-500', 'border-gray-600', 'border-gray-700', 'border-gray-800', 'border-gray-900',
    'rounded', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full', 'rounded-t-lg', 'rounded-b-lg', 'rounded-l-lg', 'rounded-r-lg',
    
    // Effects
    'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner', 'shadow-none',
    'opacity-0', 'opacity-25', 'opacity-50', 'opacity-75', 'opacity-100',
    'overflow-auto', 'overflow-hidden', 'overflow-visible', 'overflow-scroll', 'overflow-x-auto', 'overflow-y-auto',
    
    // Transforms
    'transform', 'scale-90', 'scale-100', 'scale-110', 'rotate-0', 'rotate-45', 'rotate-90', 'rotate-180',
    'translate-x-0', 'translate-x-1', 'translate-x-2', '-translate-x-1', '-translate-x-2',
    'translate-y-0', 'translate-y-1', 'translate-y-2', '-translate-y-1', '-translate-y-2',
    
    // Interactions
    'hover:bg-white', 'hover:bg-black', 'hover:bg-transparent',
    'hover:bg-amber-50', 'hover:bg-amber-100', 'hover:bg-amber-200', 'hover:bg-amber-300', 'hover:bg-amber-400', 'hover:bg-amber-500', 'hover:bg-amber-600', 'hover:bg-amber-700', 'hover:bg-amber-800', 'hover:bg-amber-900',
    'hover:text-white', 'hover:text-black',
    'hover:text-amber-50', 'hover:text-amber-100', 'hover:text-amber-200', 'hover:text-amber-300', 'hover:text-amber-400', 'hover:text-amber-500', 'hover:text-amber-600', 'hover:text-amber-700', 'hover:text-amber-800', 'hover:text-amber-900',
    'hover:scale-105', 'hover:shadow-lg', 'hover:-translate-y-1',
    'focus:outline-none', 'focus:ring-0', 'focus:ring-1', 'focus:ring-2', 'focus:ring-4',
    'focus:ring-amber-500', 'focus:ring-amber-600', 'focus:ring-amber-700',
    'focus:border-amber-500', 'focus:border-amber-600', 'focus:border-amber-700',
    'transition', 'transition-colors', 'transition-opacity', 'transition-transform', 'duration-150', 'duration-300', 'ease-in-out'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}