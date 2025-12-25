export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: TemplateCategory;
  blocks: import('./website').WebsiteBlock[];
  settings: import('./website').WebsiteSettings;
}

export type TemplateCategory = 
  | 'portfolio'
  | 'personal'
  | 'business'
  | 'creative'
  | 'minimal'
  | 'blog';

export interface EditorState {
  selectedBlockId: string | null;
  isPreviewMode: boolean;
  isMobilePreview: boolean;
  undoStack: import('./website').WebsiteBlock[][];
  redoStack: import('./website').WebsiteBlock[][];
  isDragging: boolean;
  zoom: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
