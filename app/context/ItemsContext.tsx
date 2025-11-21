'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

const STORAGE_KEY = 'mirror-org-items';

// Save items to localStorage
const saveItemsToStorage = (items: Item[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving items to localStorage:', error);
  }
};

export function ItemsProvider({ children }: { children: ReactNode }) {
  // Always start with mockData to ensure server/client consistency
  const [items, setItems] = useState<Item[]>(mockData);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<Item | null>(null);

  // Load from localStorage only on client after mount (to avoid hydration mismatch)
  // Merge localStorage data with mockData to preserve new items from mockData
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Item[];
        // Create a map of existing items by ID
        const existingItemsMap = new Map<string, Item>(parsed.map((item) => [item.id, item]));
        // Add any items from mockData that don't exist in localStorage
        mockData.forEach((mockItem) => {
          if (!existingItemsMap.has(mockItem.id)) {
            existingItemsMap.set(mockItem.id, mockItem);
          }
        });
        // Convert back to array
        const mergedItems: Item[] = Array.from(existingItemsMap.values());
        setItems(mergedItems);
      } else {
        // If no localStorage data, initialize with mockData
        setItems(mockData);
      }
    } catch (error) {
      console.error('Error loading items from localStorage:', error);
      // On error, use mockData
      setItems(mockData);
    }
  }, []); // Only run once on mount

  // Save items to localStorage whenever they change
  useEffect(() => {
    saveItemsToStorage(items);
  }, [items]);

  const addItem = (item: Item) => {
    // Add new items at the beginning of the array so they appear at the top
    setItems((prev) => [item, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } as Item : item))
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

