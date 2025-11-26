import React from 'react';
import { CardData } from '../types';
import { CARD_CONFIG } from '../constants';
import { Hash } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CardListProps {
  cards: CardData[];
  onCardClick: (card: CardData) => void;
}

export const CardList: React.FC<CardListProps> = ({ cards, onCardClick }) => {
  if (cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Hash size={32} className="opacity-20" />
        </div>
        <p>No cards found</p>
        <p className="text-sm opacity-60 mt-1">Create a new card to get started</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {cards.map((card) => {
          const config = CARD_CONFIG[card.type];
          const Icon = config.icon;
          
          return (
            <div
              key={card.id}
              onClick={() => onCardClick(card)}
              className="group relative bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-72 overflow-hidden"
            >
              {/* Card Header Stripe */}
              <div className={`h-1 w-full ${config.color.replace('text-', 'bg-')} opacity-80`}></div>
              
              <div className="p-5 flex flex-col flex-1 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-1.5 rounded-md ${config.bgColor} dark:bg-opacity-10`}>
                    <Icon size={14} className={config.color} />
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600">
                     {card.id}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 leading-tight tracking-tight">
                  {card.title}
                </h3>
                
                <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-5 flex-1 font-serif prose dark:prose-invert prose-sm max-w-none prose-p:my-0">
                  <ReactMarkdown>{card.content || '*No content...*'}</ReactMarkdown>
                </div>

                <div className="mt-4 flex items-center gap-1.5 overflow-hidden">
                  {card.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700 truncate max-w-[80px]">
                      #{tag}
                    </span>
                  ))}
                  {card.tags.length > 3 && (
                    <span className="text-[10px] text-gray-400">+{card.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};