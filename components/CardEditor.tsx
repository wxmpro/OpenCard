import React, { useState, useEffect } from 'react';
import { CardData, CardType, Folder } from '../types';
import { CARD_CONFIG } from '../constants';
import { generateId, downloadMarkdown, printCard } from '../utils';
import { X, Calendar, Hash, Tag, Trash2, Share2, Download, Check } from 'lucide-react';

interface CardEditorProps {
  card?: CardData | null;
  isOpen: boolean;
  folders: Folder[];
  onClose: () => void;
  onSave: (card: CardData) => void;
  onDelete: (id: string) => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({ card, isOpen, folders, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<CardType>(CardType.BASIC);
  const [tags, setTags] = useState<string[]>([]);
  const [folderId, setFolderId] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [cardId, setCardId] = useState('');
  const [createdAt, setCreatedAt] = useState<number>(Date.now());
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (card) {
        setCardId(card.id);
        setTitle(card.title);
        setContent(card.content);
        setType(card.type);
        setTags(card.tags);
        setFolderId(card.folderId || '');
        setCreatedAt(card.createdAt);
      } else {
        // Reset for new card
        setCardId(generateId());
        setTitle('');
        setContent('');
        setType(CardType.BASIC);
        setTags([]);
        setFolderId('');
        setTagInput('');
        setCreatedAt(Date.now());
      }
    }
  }, [card, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    const newCard: CardData = {
      id: cardId,
      title,
      content,
      type,
      tags,
      folderId: folderId || undefined,
      createdAt,
      updatedAt: Date.now(),
    };
    onSave(newCard);
    onClose();
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleShare = async () => {
    const text = `${title}\n\n${content}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(text);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  const handleExport = () => {
    // Simple Menu for export
    // For now, just trigger PDF print
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1C1C1E] w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Header */}
        <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-gray-50/50 dark:bg-[#2C2C2E]">
          <div className="flex items-center space-x-3 text-sm">
            <span className="font-mono text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
              ID: {cardId}
            </span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <div className="relative group">
               <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="appearance-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 py-1 pl-2 pr-6 rounded cursor-pointer outline-none transition-colors text-xs"
              >
                <option value="">Inbox</option>
                {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button 
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors relative"
                title="Share or Copy"
            >
                <Share2 size={18} />
                {showShareTooltip && (
                    <span className="absolute top-full right-0 mt-1 bg-black text-white text-[10px] px-2 py-1 rounded">Copied!</span>
                )}
            </button>
            
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>

            <button 
                onClick={() => downloadMarkdown({ id: cardId, title, content, tags })}
                className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Export Markdown"
            >
                <Hash size={18} />
            </button>
            <button 
                onClick={() => printCard({ id: cardId, title, content, tags })}
                className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Export PDF (Print)"
            >
                <Download size={18} />
            </button>

            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>

            {card && (
              <button 
                onClick={() => {
                    if(window.confirm('Delete this card?')) {
                        onDelete(cardId);
                        onClose();
                    }
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Top Controls */}
        <div className="px-8 pt-6 pb-2">
             <div className="flex items-center space-x-4 mb-4">
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CardType)}
                    className="appearance-none bg-gray-100 dark:bg-[#2C2C2E] hover:bg-gray-200 dark:hover:bg-[#3A3A3C] text-gray-700 dark:text-gray-200 py-1 px-3 rounded text-xs font-medium outline-none cursor-pointer transition-colors border border-transparent focus:border-blue-500"
                >
                    {Object.values(CardType).map(t => (
                    <option key={t} value={t}>{CARD_CONFIG[t].label}</option>
                    ))}
                </select>
             </div>

            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Card"
                className="text-3xl font-bold text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 outline-none bg-transparent w-full font-display"
                autoFocus
            />
        </div>

        {/* Main Content Area (Lined Paper) */}
        <div className="flex-1 relative bg-white dark:bg-[#1C1C1E]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full px-8 py-4 text-lg text-gray-800 dark:text-gray-200 outline-none resize-none lined-paper leading-8 font-serif bg-transparent"
            placeholder="Write something... (Markdown supported)"
            style={{
                fontFamily: 'Georgia, "Times New Roman", Times, serif'
            }}
          />
        </div>

        {/* Bottom Bar: Tags & Save */}
        <div className="h-16 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 bg-gray-50/50 dark:bg-[#2C2C2E]">
            
            {/* Tag Input (Bottom Left) */}
            <div className="flex items-center space-x-2 bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900 transition-all shadow-sm">
              <Tag size={14} className="text-gray-400" />
              <div className="flex items-center gap-1.5">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500"><X size={10} /></button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "Add tags..." : ""}
                className="bg-transparent text-sm outline-none min-w-[80px] text-gray-700 dark:text-gray-200 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center space-x-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={!title.trim()}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    Save Card
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};