import React from 'react'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md", text = "Loading..." }) => {
  // Size mapping for flexibility
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4 select-none">
      <div 
        className={`${sizeClasses[size]} border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}
      />
      {text && (
        <p className="text-sm font-medium text-slate-500 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

export default Spinner
