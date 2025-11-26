export enum CardType {
  PERSON = 'Person',
  TERM = 'Term',
  EVENT = 'Event',
  BASIC = 'Basic',
  NEW_KNOWLEDGE = 'New Knowledge',
  ACTION = 'Action',
  QUOTE = 'Quote',
  FREE = 'Free'
}

export interface CardData {
  id: string; // YYYYMMDDHHmm
  title: string;
  content: string;
  type: CardType;
  tags: string[];
  folderId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string; // For nesting
  isOpen?: boolean; // UI state for expansion
}

export type FilterType = 'ALL' | CardType;