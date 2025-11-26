import React, { useState } from 'react';
import { Folder, CardData } from '../types';
import { Folder as FolderIcon, FolderOpen, Plus, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';

interface FolderPanelProps {
  folders: Folder[];
  currentFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
  onToggleFolder: (id: string) => void;
}

export const FolderPanel: React.FC<FolderPanelProps> = ({
  folders,
  currentFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  onToggleFolder
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-60 bg-gray-50/90 dark:bg-[#2C2C2E]/90 backdrop-blur-xl h-full border-l border-gray-200 dark:border-gray-700 flex flex-col shrink-0 select-none">
       <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700/50">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Folders</span>
        <button 
          onClick={() => setIsCreating(true)}
          className="text-gray-400 hover:text-blue-500 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {/* Inbox / All */}
        <div 
            onClick={() => onSelectFolder(null)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer text-sm mb-2 ${
                currentFolderId === null 
                ? 'bg-blue-100/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5'
            }`}
        >
            <FolderOpen size={16} className="text-blue-500" />
            <span>Inbox</span>
        </div>

        {isCreating && (
          <form onSubmit={handleCreate} className="px-2 mb-2">
            <input
              autoFocus
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={() => setIsCreating(false)}
              className="w-full bg-white dark:bg-[#3A3A3C] border border-blue-400 rounded px-2 py-1 text-sm outline-none dark:text-white"
              placeholder="Folder Name"
            />
          </form>
        )}

        {folders.map(folder => {
            const isActive = currentFolderId === folder.id;
            return (
                <div key={folder.id} className="group flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer text-sm hover:bg-gray-200/50 dark:hover:bg-white/5 mb-1 transition-colors"
                    onClick={() => onSelectFolder(folder.id)}
                >
                    <div className={`flex items-center space-x-2 ${isActive ? 'text-blue-600 dark:text-blue-300 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                        <FolderIcon size={14} className={isActive ? 'fill-blue-500/20 stroke-blue-600' : ''} />
                        <span>{folder.name}</span>
                    </div>
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            if(window.confirm('Delete folder? Cards will move to Inbox.')) onDeleteFolder(folder.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            );
        })}
      </div>
    </div>
  );
};