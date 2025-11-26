import React, { useState, useEffect } from 'react';
import { CardType, FilterType } from '../types';
import { CARD_CONFIG } from '../constants';
import { LayoutGrid, Plus, Moon, Sun, GripVertical } from 'lucide-react';

interface SidebarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onNewCard: () => void;
  totalCount: number;
  width: number;
  setWidth: (w: number) => void;
  isDark: boolean;
  toggleDark: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentFilter, 
  onFilterChange, 
  onNewCard, 
  totalCount,
  width,
  setWidth,
  isDark,
  toggleDark
}) => {
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = Math.min(Math.max(e.clientX, 200), 400); // Min 200, Max 400
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setWidth]);

  return (
    <div 
      className="bg-gray-50/90 dark:bg-[#2C2C2E]/90 backdrop-blur-xl h-full border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 select-none relative group"
      style={{ width }}
    >
      {/* Drag Handle */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 z-10 transition-colors opacity-0 group-hover:opacity-100"
        onMouseDown={() => setIsResizing(true)}
      />

      {/* Mac Traffic Lights & Dark Mode */}
      <div className="h-12 flex items-center justify-between px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/20 hover:bg-red-500 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/20 hover:bg-yellow-500 transition-colors"></div>
          <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/20 hover:bg-green-500 transition-colors"></div>
        </div>
        <button 
          onClick={toggleDark}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>

      <div className="px-4 py-2">
         <button
          onClick={onNewCard}
          className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-[#3A3A3C] border border-gray-200 dark:border-gray-600 shadow-sm text-gray-700 dark:text-gray-200 py-1.5 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-[#48484A] active:scale-[0.98] transition-all text-sm font-medium"
        >
          <Plus size={16} />
          <span>New Card</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2 mt-2">Library</div>
        
        <button
          onClick={() => onFilterChange('ALL')}
          className={`w-full flex items-center space-x-3 px-2 py-1.5 rounded-md text-sm transition-colors ${
            currentFilter === 'ALL' 
              ? 'bg-blue-500 text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/10'
          }`}
        >
          <LayoutGrid size={16} />
          <span className="flex-1 text-left">All Cards</span>
          <span className={`${currentFilter === 'ALL' ? 'text-blue-100' : 'text-gray-400'} text-xs`}>{totalCount}</span>
        </button>

        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2 mt-6">Types</div>
        
        {Object.values(CardType).map((type) => {
          const config = CARD_CONFIG[type];
          const Icon = config.icon;
          const isActive = currentFilter === type;
          
          return (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={`w-full flex items-center space-x-3 px-2 py-1.5 rounded-md text-sm transition-colors ${
                isActive 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/10'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : config.color} />
              <span className="flex-1 text-left">{config.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 text-center">
        CardOS v1.1
      </div>
    </div>
  );
};