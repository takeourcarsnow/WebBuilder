import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Website, WebsiteBlock, WebsiteSettings, BlockType, BlockContent, BlockStyle, BlockGroup, AnimationConfig } from '@/types';
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
  
  // Bulk block actions
  deleteBlocks: (blockIds: string[]) => void;
  duplicateBlocks: (blockIds: string[]) => WebsiteBlock[];
  
  // Block locking
  toggleBlockLock: (blockId: string) => void;
  lockBlocks: (blockIds: string[]) => void;
  unlockBlocks: (blockIds: string[]) => void;
  
  // Block visibility
  toggleBlockVisibility: (blockId: string) => void;
  hideBlocks: (blockIds: string[]) => void;
  showBlocks: (blockIds: string[]) => void;
  
  // Block comments
  setBlockComment: (blockId: string, comment: string) => void;
  clearBlockComment: (blockId: string) => void;
  
  // Block animation
  setBlockAnimation: (blockId: string, animation: AnimationConfig) => void;
  
  // Block custom CSS
  setBlockCustomCSS: (blockId: string, css: string) => void;
  
  // Block grouping
  createGroup: (name: string, blockIds: string[]) => BlockGroup;
  deleteGroup: (groupId: string) => void;
  renameGroup: (groupId: string, name: string) => void;
  addBlocksToGroup: (groupId: string, blockIds: string[]) => void;
  removeBlocksFromGroup: (blockIds: string[]) => void;
  toggleGroupCollapse: (groupId: string) => void;
  
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
      
      // Bulk block actions
      deleteBlocks: (blockIds) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks
                .filter((b) => !blockIds.includes(b.id))
                .map((b, i) => ({ ...b, order: i })),
              updatedAt: new Date(),
            },
          };
        });
      },

      duplicateBlocks: (blockIds) => {
        const website = get().website;
        if (!website) return [];

        const blocksToDuplicate = website.blocks.filter((b) => blockIds.includes(b.id));
        const newBlocks: WebsiteBlock[] = blocksToDuplicate.map((block) => ({
          ...block,
          id: generateId(),
          content: { ...block.content },
          style: { ...block.style },
          order: website.blocks.length,
        }));

        set((state) => {
          if (!state.website) return state;

          const updatedBlocks = [...state.website.blocks, ...newBlocks].map((b, i) => ({ ...b, order: i }));

          return {
            website: {
              ...state.website,
              blocks: updatedBlocks,
              updatedAt: new Date(),
            },
          };
        });

        return newBlocks;
      },
      
      // Block locking
      toggleBlockLock: (blockId) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                b.id === blockId ? { ...b, isLocked: !b.isLocked } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      lockBlocks: (blockIds) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                blockIds.includes(b.id) ? { ...b, isLocked: true } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      unlockBlocks: (blockIds) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                blockIds.includes(b.id) ? { ...b, isLocked: false } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },
      
      // Block visibility
      toggleBlockVisibility: (blockId) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                b.id === blockId ? { ...b, isVisible: b.isVisible === false ? true : false } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      hideBlocks: (blockIds) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                blockIds.includes(b.id) ? { ...b, isVisible: false } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      showBlocks: (blockIds) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                blockIds.includes(b.id) ? { ...b, isVisible: true } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },
      
      // Block comments
      setBlockComment: (blockId, comment) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                b.id === blockId ? { ...b, comment } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      clearBlockComment: (blockId) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                b.id === blockId ? { ...b, comment: undefined } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },
      
      // Block animation
      setBlockAnimation: (blockId, animation) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                b.id === blockId ? { ...b, animation } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },
      
      // Block custom CSS
      setBlockCustomCSS: (blockId, css) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                b.id === blockId ? { ...b, customCSS: css } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },
      
      // Block grouping
      createGroup: (name, blockIds) => {
        const groupId = generateId();
        const newGroup: BlockGroup = {
          id: groupId,
          name,
          isCollapsed: false,
          order: get().website?.groups?.length || 0,
        };

        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              groups: [...(state.website.groups || []), newGroup],
              blocks: state.website.blocks.map((b) =>
                blockIds.includes(b.id) ? { ...b, groupId } : b
              ),
              updatedAt: new Date(),
            },
          };
        });

        return newGroup;
      },

      deleteGroup: (groupId) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              groups: (state.website.groups || []).filter((g) => g.id !== groupId),
              blocks: state.website.blocks.map((b) =>
                b.groupId === groupId ? { ...b, groupId: undefined } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      renameGroup: (groupId, name) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              groups: (state.website.groups || []).map((g) =>
                g.id === groupId ? { ...g, name } : g
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      addBlocksToGroup: (groupId, blockIds) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                blockIds.includes(b.id) ? { ...b, groupId } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      removeBlocksFromGroup: (blockIds) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              blocks: state.website.blocks.map((b) =>
                blockIds.includes(b.id) ? { ...b, groupId: undefined } : b
              ),
              updatedAt: new Date(),
            },
          };
        });
      },

      toggleGroupCollapse: (groupId) => {
        set((state) => {
          if (!state.website) return state;

          return {
            website: {
              ...state.website,
              groups: (state.website.groups || []).map((g) =>
                g.id === groupId ? { ...g, isCollapsed: !g.isCollapsed } : g
              ),
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
