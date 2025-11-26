import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { CardList } from './components/CardList';
import { CardEditor } from './components/CardEditor';
import { FolderPanel } from './components/FolderPanel';
import { CardData, FilterType, Folder } from './types';
import { Search, Sidebar as SidebarIcon } from 'lucide-react';

export default function App() {
  // State
  const [cards, setCards] = useState<CardData[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Load Data
  useEffect(() => {
    const savedCards = localStorage.getItem('cardos_data');
    if (savedCards) {
        try { setCards(JSON.parse(savedCards)); } catch (e) { console.error(e); }
    }
    const savedFolders = localStorage.getItem('cardos_folders');
    if (savedFolders) {
        try { setFolders(JSON.parse(savedFolders)); } catch (e) { console.error(e); }
    }
    const savedTheme = localStorage.getItem('cardos_theme');
    if (savedTheme === 'dark') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
    }
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem('cardos_data', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('cardos_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('cardos_theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('cardos_theme', 'light');
    }
  }, [isDark]);

  // Derived state (filtered cards)
  const filteredCards = useMemo(() => {
    let result = cards;

    // Folder Filter (Only apply if we are not filtering by Type, or apply both?)
    // Logic: If folder is selected, show only cards in that folder.
    if (currentFolderId !== null) {
        result = result.filter(card => card.folderId === currentFolderId);
    } else {
        // If "Inbox" (null) is selected, maybe show cards with no folder? 
        // Or show ALL cards if it acts as "Library"?
        // Let's make "Inbox" show cards with NO folder or ALL cards?
        // Usually Inbox = No Folder. "All Cards" in sidebar covers everything.
        // Let's assume FolderPanel null selection = "Inbox" (No Folder)
        result = result.filter(card => !card.folderId);
    }

    // Type Filter (Sidebar overrides folder view typically, or filters within folder)
    // Let's make Left Sidebar "All Cards" override folder selection to show EVERYTHING.
    // If Left Sidebar is specific Type, it shows that type within current folder context? 
    // To keep it simple: Left Sidebar "All Cards" shows everything (ignores folder).
    // Left Sidebar "Type" shows type (ignores folder).
    // Right Sidebar "Folder" shows folder content (ignores type).
    // This implies the UI selection state needs to be managed carefully.
    // Let's prioritize the last interaction.
    // Actually, prompt says: "Right side has folders... Left side layout".
    // Standard approach: Folders filter content. Types filter content. They can combine.
    // Let's combine: Show cards in `currentFolderId` that match `filter`.
    // If `currentFolderId` is null (Inbox), show cards with no folder.
    
    // HOWEVER, to make it user friendly:
    // If I click "All Cards" on left, I probably want to see everything regardless of folder.
    // Let's add a special mode.
    // Simplified logic for this MVP:
    // 1. If Filter is 'ALL' AND currentFolderId is null -> Show "Inbox" (No folder) ?? 
    // No, standard Mac apps: "All" shows everything. Specific folder shows folder.
    // Let's separate "All" view from "Folder" view.
    // But for now, let's just chain them.
    
    // Revised Logic: 
    // Sidebar 'ALL' -> Reset Folder to null? No.
    // Let's do this:
    // The Left Sidebar acts as a "Smart Filter".
    // The Right Sidebar acts as a "Source".
    // If I select a folder, I see things in that folder.
    // If I select a Type, I see things of that type in the current folder?
    // Let's keep it simple. Left sidebar is dominant for Types. Right is for organizing.
    // If currentFolderId is set, we filter by it.
    
    // Correction: If user clicks "All Cards" in left sidebar, we should probably clear folder selection or show all.
    // Let's treat "All Cards" as a reset.
    // But the `filter` state is `ALL` by default.
    
    // Let's just implement: result = cards.
    // 1. Filter by Folder (if strictly in folder mode). 
    // Let's treat `currentFolderId` as the primary view source.
    // If `currentFolderId` is 'ALL_LIBRARY' (special), show all.
    // If `currentFolderId` is null ('Inbox'), show unfiled.
    // But we also have `filter` (Type).
    
    if (currentFolderId) {
        result = result.filter(c => c.folderId === currentFolderId);
    } else {
        // Inbox mode: Show cards with no folder
        result = result.filter(c => !c.folderId);
    }

    // 2. Filter by Type
    if (filter !== 'ALL') {
        result = result.filter(card => card.type === filter);
    }

    // 3. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(card => 
        card.title.toLowerCase().includes(q) || 
        card.content.toLowerCase().includes(q) ||
        card.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => b.createdAt - a.createdAt);
  }, [cards, filter, searchQuery, currentFolderId]);

  // Handlers
  const handleSaveCard = (card: CardData) => {
    setCards(prev => {
      const exists = prev.find(c => c.id === card.id);
      if (exists) {
        return prev.map(c => c.id === card.id ? card : c);
      }
      return [card, ...prev];
    });
  };

  const handleDeleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
        id: Date.now().toString(),
        name,
        isOpen: true
    };
    setFolders([...folders, newFolder]);
  };

  const handleDeleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    // Move cards to Inbox (remove folderId)
    setCards(prev => prev.map(c => c.folderId === id ? { ...c, folderId: undefined } : c));
    if (currentFolderId === id) setCurrentFolderId(null);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 dark:bg-[#1C1C1E] text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-200">
      <Sidebar 
        currentFilter={filter} 
        onFilterChange={setFilter} 
        onNewCard={() => { setEditingCard(null); setIsEditorOpen(true); }}
        totalCount={cards.length}
        width={sidebarWidth}
        setWidth={setSidebarWidth}
        isDark={isDark}
        toggleDark={() => setIsDark(!isDark)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 bg-white/50 dark:bg-black/20 relative">
        {/* Top Bar */}
        <header className="h-12 bg-white/80 dark:bg-[#2C2C2E]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center px-4 justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <span className="opacity-50 mr-2">/</span>
            <span>{currentFolderId ? folders.find(f => f.id === currentFolderId)?.name : 'Inbox'}</span>
            <span className="opacity-50 mx-2">/</span>
            <span className="text-gray-500">{filter === 'ALL' ? 'All Types' : filter}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm outline-none focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all w-48 focus:w-64"
                />
            </div>
            <button 
                onClick={() => setShowRightPanel(!showRightPanel)}
                className={`p-1.5 rounded-md transition-colors ${showRightPanel ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                <SidebarIcon size={18} className="rotate-180" />
            </button>
          </div>
        </header>

        {/* Content */}
        <CardList cards={filteredCards} onCardClick={(card) => { setEditingCard(card); setIsEditorOpen(true); }} />
      </main>

      {/* Right Sidebar (Folders) */}
      {showRightPanel && (
          <FolderPanel 
            folders={folders}
            currentFolderId={currentFolderId}
            onSelectFolder={setCurrentFolderId}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
            onToggleFolder={() => {}}
          />
      )}

      <CardEditor 
        isOpen={isEditorOpen}
        card={editingCard}
        folders={folders}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveCard}
        onDelete={handleDeleteCard}
      />
    </div>
  );
}