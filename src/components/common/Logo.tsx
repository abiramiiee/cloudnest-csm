import React from 'react';
import { Cloud, Folder } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-bold',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/20 ${iconSizes[size]}`}>
        <Cloud className="w-5 h-5 absolute" />
        <Folder className="w-3.5 h-3.5 absolute translate-x-1 translate-y-1 text-white/90 drop-shadow" />
      </div>
      <div>
        <div className={`tracking-tight text-slate-900 dark:text-white flex items-center gap-1 ${textSizes[size]}`}>
          <span>Cloud</span>
          <span className="text-violet-600 dark:text-violet-400">Nest</span>
        </div>
        {showTagline && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 tracking-normal font-normal">
            Your Files. Your Space. Your Control.
          </p>
        )}
      </div>
    </div>
  );
};
