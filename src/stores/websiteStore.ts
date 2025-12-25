import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Website, WebsiteBlock, WebsiteSettings, BlockType, BlockContent, BlockStyle } from '@/types';
import { generateId } from '@/lib/utils';
import { getBlockDefinition } from '@/lib/constants';

interface WebsiteState {
  website: Website | null;
  websites: Website[];
  
  // Website actions
  createWebsite: (name: string, template?: Partial<Website>) => Website;
  updateWebsite: (updates: Partial<Website>) => void;
  deleteWebsite: (id: string) => void;
  loadWebsite: (id: string) => void;
  setCurrentWebsite: (website: Website | null) => void;
  
  // Block actions
  addBlock: (type: BlockType, index?: number) => WebsiteBlock;
  updateBlock: (blockId: string, updates: Partial<WebsiteBlock>) => void;
  updateBlockContent: (blockId: string, content: Partial<BlockContent>) => void;
  updateBlockStyle: (blockId: string, style: Partial<BlockStyle>) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => WebsiteBlock | null;
  moveBlock: (blockId: string, newIndex: number) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<WebsiteSettings>) => void;
}

export const useWebsiteStore = create<WebsiteState>()(
  persist(
    (set, get) => ({
      website: null,
      websites: [],

      createWebsite: (name, template) => {
        const newWebsite: Website = {
          id: generateId(),
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          blocks: template?.blocks || [],
          settings: template?.settings || {
            title: name,
            description: '',
            theme: {
              mode: 'light',
              primaryColor: '#0ea5e9',
              secondaryColor: '#64748b',
              backgroundColor: '#ffffff',
              textColor: '#000000',
              accentColor: '#0ea5e9',
            },
            fonts: {
              heading: '-apple-system, BlinkMacSystemFont, sans-serif',
              body: '-apple-system, BlinkMacSystemFont, sans-serif',
              headingSize: 'medium',
              bodySize: 'medium',
            },
            socialLinks: [],
            seo: {},
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          website: newWebsite,
          websites: [...state.websites, newWebsite],
        }));

        return newWebsite;
      },

      updateWebsite: (updates) => {
        set((state) => {
          if (!state.website) return state;
          
          const updatedWebsite = {
            ...state.website,
            ...updates,
            updatedAt: new Date(),
          };

          return {
            website: updatedWebsite,
            websites: state.websites.map((w) =>
              w.id === updatedWebsite.id ? updatedWebsite : w
            ),
          };
        });
      },

      deleteWebsite: (id) => {
        set((state) => ({
          website: state.website?.id === id ? null : state.website,
          websites: state.websites.filter((w) => w.id !== id),
        }));
      },

      loadWebsite: (id) => {
        const website = get().websites.find((w) => w.id === id);
        if (website) {
          set({ website });
        }
      },

      setCurrentWebsite: (website) => {
        set({ website });
      },

      addBlock: (type, index) => {
        const definition = getBlockDefinition(type);
        if (!definition) throw new Error(`Unknown block type: ${type}`);

        const blocks = get().website?.blocks || [];
        const newBlock: WebsiteBlock = {
          id: generateId(),
          type,
          content: { ...definition.defaultContent },
          style: { ...definition.defaultStyle },
          order: index !== undefined ? index : blocks.length,
        };

        set((state) => {
          if (!state.website) return state;

          let newBlocks: WebsiteBlock[];
          if (index !== undefined) {
            newBlocks = [
              ...blocks.slice(0, index),
              newBlock,
              ...blocks.slice(index),
            ].map((b, i) => ({ ...b, order: i }));
          } else {
            newBlocks = [...blocks, newBlock];
          }

          return {
            website: {
              ...state.website,
              blocks: newBlocks,
              updatedAt: new Date(),
            },
          };
        });

        return newBlock;
      },

      updateBlock: (blockId, updates) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                b.id === blockId ? { ...b, ...updates } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      updateBlockContent: (blockId, content) => {
        set((state) => {
          if (!state.website) return state;

          const filteredContent = Object.fromEntries(
            Object.entries(content).filter(([_, v]) => v !== undefined)
          ) as BlockContent;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                b.id === blockId
                  ? { ...b, content: { ...b.content, ...filteredContent } }
                  : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      updateBlockStyle: (blockId, style) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                b.id === blockId
                  ? { ...b, style: { ...b.style, ...style } }
                  : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      deleteBlock: (blockId) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks
                .filter((b) => b.id !== blockId)
                .map((b, i) => ({ ...b, order: i })),
              updatedAt: new Date(),
            },
          };
        });
      },

      duplicateBlock: (blockId) => {
        const website = get().website;
        if (!website) return null;

        const block = website.blocks.find((b) => b.id === blockId);
        if (!block) return null;

        const newBlock: WebsiteBlock = {
          ...block,
          id: generateId(),
          content: { ...block.content },
          style: { ...block.style },
          order: block.order + 1,
        };

        set((state) => {
          if (!state.website) return state;

          const newBlocks = [
            ...state.website.blocks.slice(0, block.order + 1),
            newBlock,
            ...state.website.blocks.slice(block.order + 1),
          ].map((b, i) => ({ ...b, order: i }));

          return {
            website: {
              ...state.website,
              blocks: newBlocks,
              updatedAt: new Date(),
            },
          };
        });

        return newBlock;
      },

      moveBlock: (blockId, newIndex) => {
        set((state) => {
          if (!state.website) return state;

          const blocks = [...state.website.blocks];
          const currentIndex = blocks.findIndex((b) => b.id === blockId);
          if (currentIndex === -1) return state;

          const [block] = blocks.splice(currentIndex, 1);
          blocks.splice(newIndex, 0, block);

          return {
            website: {
              ...state.website,
              blocks: blocks.map((b, i) => ({ ...b, order: i })),
              updatedAt: new Date(),
            },
          };
        });
      },

      reorderBlocks: (activeId, overId) => {
        set((state) => {
          if (!state.website) return state;

          const blocks = [...state.website.blocks];
          const activeIndex = blocks.findIndex((b) => b.id === activeId);
          const overIndex = blocks.findIndex((b) => b.id === overId);

          if (activeIndex === -1 || overIndex === -1) return state;

          const [movedBlock] = blocks.splice(activeIndex, 1);
          blocks.splice(overIndex, 0, movedBlock);

          return {
            website: {
              ...state.website,
              blocks: blocks.map((b, i) => ({ ...b, order: i })),
              updatedAt: new Date(),
            },
          };
        });
      },

      updateSettings: (settings) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              settings: {
                ...state.website.settings,
                ...settings,
              },
              updatedAt: new Date(),
            },
          };
        });
      },
    }),
    {
      name: 'website-storage',
    }
  )
);
