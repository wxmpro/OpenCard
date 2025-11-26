import React from 'react';
import { CardType } from './types';
import { 
  User, 
  BookOpen, 
  Calendar, 
  FileText, 
  Lightbulb, 
  CheckSquare, 
  Quote, 
  PenTool 
} from 'lucide-react';

export const CARD_CONFIG: Record<CardType, { color: string; icon: React.FC<any>; label: string; bgColor: string }> = {
  [CardType.PERSON]: { 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-50',
    icon: User, 
    label: '人物卡' 
  },
  [CardType.TERM]: { 
    color: 'text-purple-500', 
    bgColor: 'bg-purple-50',
    icon: BookOpen, 
    label: '术语卡' 
  },
  [CardType.EVENT]: { 
    color: 'text-orange-500', 
    bgColor: 'bg-orange-50',
    icon: Calendar, 
    label: '事件卡' 
  },
  [CardType.BASIC]: { 
    color: 'text-gray-500', 
    bgColor: 'bg-gray-50',
    icon: FileText, 
    label: '基础卡' 
  },
  [CardType.NEW_KNOWLEDGE]: { 
    color: 'text-yellow-500', 
    bgColor: 'bg-yellow-50',
    icon: Lightbulb, 
    label: '新知卡' 
  },
  [CardType.ACTION]: { 
    color: 'text-red-500', 
    bgColor: 'bg-red-50',
    icon: CheckSquare, 
    label: '行动卡' 
  },
  [CardType.QUOTE]: { 
    color: 'text-teal-500', 
    bgColor: 'bg-teal-50',
    icon: Quote, 
    label: '金句卡' 
  },
  [CardType.FREE]: { 
    color: 'text-green-500', 
    bgColor: 'bg-green-50',
    icon: PenTool, 
    label: '自由卡' 
  },
};