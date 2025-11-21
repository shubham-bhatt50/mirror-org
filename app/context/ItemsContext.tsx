'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Item, Stage, ItemType } from '../types';
import { mockData } from '../utils/mockData';

interface ItemsContextType {
  items: Item[];
  addItem: (item: Item) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  currentFolder: string | null;
  setCurrentFolder: (id: string | null) => void;
  selectedContent: Item | null;
  setSelectedContent: (item: Item | null) => void;
  breadcrumbs: { id: string | null; name: string }[];
  getFolderDepth: (folderId: string | null) => number;
  getEffectivePlaygroundMode: (itemId: string | null) => boolean;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(mockData);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<Item | null>(null);

  const addItem = (item: Item) => {
    // Add new items at the beginning of the array so they appear at the top
    setItems((prev) => [item, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => {
      // Recursively find all child items
      const findChildren = (parentId: string): string[] => {
        const children = prev.filter(item => item.parentId === parentId);
        const childIds = children.map(child => child.id);
        // Recursively find children of children
        const allChildIds = [...childIds];
        children.forEach(child => {
          allChildIds.push(...findChildren(child.id));
        });
        return allChildIds;
      };

      const itemsToDelete = new Set([id, ...findChildren(id)]);
      return prev.filter((item) => !itemsToDelete.has(item.id));
    });
    
    // If we're deleting the current folder, navigate back
    if (currentFolder === id) {
      const deletedItem = items.find(item => item.id === id);
      setCurrentFolder(deletedItem?.parentId || null);
    }
  };

  // Calculate folder depth (0 = root, 1 = first level, 2 = second level, 3 = third level)
  const getFolderDepth = (folderId: string | null): number => {
    if (folderId === null) return 0;
    
    const findDepth = (id: string, allItems: Item[]): number => {
      const item = allItems.find((i) => i.id === id);
      if (!item) return 0;
      
      if (item.parentId === null) {
        return 1; // First level folder
      }
      
      return 1 + findDepth(item.parentId, allItems);
    };
    
    return findDepth(folderId, items);
  };

  // Get effective playground mode by walking up the folder tree
  // Returns the first explicit value found, or false if none found
  // itemId can be a folder ID or any item ID (will check its parent folder)
  const getEffectivePlaygroundMode = (itemId: string | null): boolean => {
    if (itemId === null) return false; // Root level, no playground mode
    
    const item = items.find((i) => i.id === itemId);
    if (!item) return false;
    
    // If the item itself is a folder, check it first
    if (item.type === 'folder') {
      const folder = item as import('../types').Folder;
      if (folder.playgroundMode !== null && folder.playgroundMode !== undefined) {
        return folder.playgroundMode;
      }
    }
    
    // Walk up the parent chain
    const findPlaygroundMode = (id: string | null, allItems: Item[]): boolean => {
      if (id === null) return false; // Reached root, default to false
      
      const folderItem = allItems.find((i) => i.id === id);
      if (!folderItem || folderItem.type !== 'folder') return false;
      
      const folder = folderItem as import('../types').Folder;
      
      // If this folder has an explicit playgroundMode value, return it
      if (folder.playgroundMode !== null && folder.playgroundMode !== undefined) {
        return folder.playgroundMode;
      }
      
      // Otherwise, check parent
      return findPlaygroundMode(folderItem.parentId, allItems);
    };
    
    return findPlaygroundMode(item.parentId, items);
  };

  // Calculate breadcrumbs based on current folder
  const breadcrumbs = (() => {
    const crumbs: { id: string | null; name: string }[] = [
      { id: null, name: 'Content' },
    ];
    
    if (currentFolder) {
      const findPath = (
        id: string,
        allItems: Item[]
      ): { id: string; name: string }[] | null => {
        const item = allItems.find((i) => i.id === id);
        if (!item) return null;

        if (item.parentId === null) {
          return [{ id: item.id, name: item.name }];
        }

        const parentPath = findPath(item.parentId, allItems);
        if (parentPath) {
          return [...parentPath, { id: item.id, name: item.name }];
        }
        return null;
      };

      const path = findPath(currentFolder, items);
      if (path) {
        crumbs.push(...path);
      }
    }

    return crumbs;
  })();

  return (
    <ItemsContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        deleteItem,
        currentFolder,
        setCurrentFolder,
        selectedContent,
        setSelectedContent,
        breadcrumbs,
        getFolderDepth,
        getEffectivePlaygroundMode,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
}

