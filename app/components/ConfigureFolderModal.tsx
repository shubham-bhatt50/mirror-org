'use client';

import { useState, useEffect, useRef } from 'react';
import { IconX } from '@tabler/icons-react';
import { Folder } from '../types';
import { useItems } from '../context/ItemsContext';

interface ConfigureFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder;
}

type TabType = 'playground' | 'assessment';

export default function ConfigureFolderModal({
  isOpen,
  onClose,
  folder,
}: ConfigureFolderModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('playground');
  const [playgroundMode, setPlaygroundMode] = useState<boolean | null>(folder.playgroundMode ?? null);
  const [hasAssessment, setHasAssessment] = useState<boolean | null>(folder.hasAssessment ?? null);
  const { updateItem, getEffectivePlaygroundMode } = useItems();
  const modalRef = useRef<HTMLDivElement>(null);

  // Update state when folder changes
  useEffect(() => {
    if (isOpen && folder) {
      setPlaygroundMode(folder.playgroundMode ?? null);
      setHasAssessment(folder.hasAssessment ?? null);
    }
  }, [isOpen, folder]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        event.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      // Use a small delay to ensure this runs after other click handlers
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    updateItem(folder.id, {
      playgroundMode: playgroundMode,
      hasAssessment: hasAssessment,
      lastUpdated: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      lastUpdatedBy: 'Shubham Bhatt',
    });

    onClose();
  };

  const inheritedPlaygroundMode = getEffectivePlaygroundMode(folder.parentId);
  const effectivePlaygroundMode = playgroundMode !== null && playgroundMode !== undefined 
    ? playgroundMode 
    : inheritedPlaygroundMode;

  // For assessment, we'll need a similar function later, for now default to false
  const effectiveAssessmentMode = hasAssessment !== null && hasAssessment !== undefined 
    ? hasAssessment 
    : false;

  const handlePlaygroundToggle = () => {
    // Toggle between enabled and disabled
    // If currently inheriting (null), set to explicit opposite of inherited value
    if (playgroundMode === null) {
      setPlaygroundMode(!inheritedPlaygroundMode);
    } else {
      setPlaygroundMode(!playgroundMode);
    }
  };

  const handleAssessmentToggle = () => {
    // Toggle between enabled and disabled
    // If currently inheriting (null), set to enabled
    if (hasAssessment === null) {
      setHasAssessment(true);
    } else {
      setHasAssessment(!hasAssessment);
    }
  };

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
        className="bg-white rounded-lg w-full max-w-lg shadow-xl" 
        style={{ padding: '0' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 className="text-xl font-semibold text-gray-800">Configure folder</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            style={{ padding: '4px' }}
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('playground');
            }}
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'playground' ? '#3b82f6' : '#6b7280',
              borderBottom: activeTab === 'playground' ? '2px solid #3b82f6' : '2px solid transparent',
              backgroundColor: activeTab === 'playground' ? '#eff6ff' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Playground mode
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('assessment');
            }}
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: activeTab === 'assessment' ? '#3b82f6' : '#6b7280',
              borderBottom: activeTab === 'assessment' ? '2px solid #3b82f6' : '2px solid transparent',
              backgroundColor: activeTab === 'assessment' ? '#eff6ff' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Assessment
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px' }} onClick={(e) => e.stopPropagation()}>
          {activeTab === 'playground' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Playground mode</h3>
                    {playgroundMode === null && (
                      <p className="text-xs text-gray-500 mt-1">
                        Inheriting from parent ({inheritedPlaygroundMode ? 'enabled' : 'disabled'})
                      </p>
                    )}
                  </div>
                  <label 
                    className="relative inline-flex items-center cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={effectivePlaygroundMode}
                      onChange={(e) => {
                        e.stopPropagation();
                        handlePlaygroundToggle();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  When enabled, playground mode links all workflows and content within this folder and its subfolders that share common screens. This creates a seamless simulation experience where users can navigate through related workflows as if they were part of a single application or process.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'assessment' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h3 className="text-base font-medium text-gray-800">Assessment mode</h3>
                    {hasAssessment === null && (
                      <p className="text-xs text-gray-500 mt-1">
                        Inheriting from parent (disabled)
                      </p>
                    )}
                  </div>
                  <label 
                    className="relative inline-flex items-center cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={effectiveAssessmentMode}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleAssessmentToggle();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  When enabled, assessment mode allows you to add quiz questions and evaluations to workflows and simulations within this folder. This enables you to test user knowledge and track learning progress through interactive assessments.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end" style={{ gap: '12px', padding: '24px', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={onClose}
            className="text-gray-700 hover:bg-gray-100 rounded-md"
            style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white rounded-md hover:bg-blue-600"
            style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

