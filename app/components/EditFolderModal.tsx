'use client';

import { useState, useEffect, useRef } from 'react';
import { IconX } from '@tabler/icons-react';
import { Folder } from '../types';
import { useItems } from '../context/ItemsContext';

interface EditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder;
}

export default function EditFolderModal({
  isOpen,
  onClose,
  folder,
}: EditFolderModalProps) {
  const [name, setName] = useState(folder.name);
  const [playgroundMode, setPlaygroundMode] = useState<boolean | null>(folder.playgroundMode ?? null);
  const { updateItem, getEffectivePlaygroundMode } = useItems();
  const modalRef = useRef<HTMLDivElement>(null);

  // Update state when folder changes
  useEffect(() => {
    if (isOpen && folder) {
      setName(folder.name);
      setPlaygroundMode(folder.playgroundMode ?? null);
    }
  }, [isOpen, folder]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;

    updateItem(folder.id, {
      name: name.trim(),
      playgroundMode: playgroundMode,
      lastUpdated: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      lastUpdatedBy: 'Shubham Bhatt',
    });

    onClose();
  };

  const inheritedMode = getEffectivePlaygroundMode(folder.parentId);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-md shadow-xl" 
        style={{ padding: '24px' }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
          <h2 className="text-xl font-semibold text-gray-800">Edit folder</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            style={{ padding: '4px' }}
          >
            <IconX size={20} />
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter folder name"
            className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            style={{ 
              padding: '10px 12px', 
              fontSize: '14px',
            }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') onClose();
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '12px' }}>
            Playground mode
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="playgroundMode"
                value="inherit"
                checked={playgroundMode === null}
                onChange={() => setPlaygroundMode(null)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Inherit from parent</span>
                <p className="text-xs text-gray-500 mt-1">
                  {inheritedMode ? 'Currently enabled' : 'Currently disabled'}
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="playgroundMode"
                value="enable"
                checked={playgroundMode === true}
                onChange={() => setPlaygroundMode(true)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Enable</span>
                <p className="text-xs text-gray-500 mt-1">
                  Links workflows with common screens in this folder and subfolders
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="playgroundMode"
                value="disable"
                checked={playgroundMode === false}
                onChange={() => setPlaygroundMode(false)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Disable</span>
                <p className="text-xs text-gray-500 mt-1">
                  Disables playground mode for this folder and subfolders (unless they override)
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end" style={{ gap: '12px' }}>
          <button
            onClick={onClose}
            className="text-gray-700 hover:bg-gray-100 rounded-md"
            style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

