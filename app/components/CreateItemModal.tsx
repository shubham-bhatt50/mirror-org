'use client';

import { useState, useEffect, useRef } from 'react';
import { IconX } from '@tabler/icons-react';
import { ItemType, Stage, Item, Workflow, Simulation, Folder } from '../types';
import { useItems } from '../context/ItemsContext';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: ItemType;
  stage: Stage;
}

export default function CreateItemModal({
  isOpen,
  onClose,
  itemType,
  stage,
}: CreateItemModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [playgroundMode, setPlaygroundMode] = useState<boolean>(false);
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const { addItem, currentFolder, getFolderDepth, items } = useItems();
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Get available workflows for simulation selection
  const availableWorkflows = items.filter((item): item is Workflow => item.type === 'workflow');

  // Clear error when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError('');
      setName('');
      setPlaygroundMode(false);
      setSelectedWorkflows([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name.trim()) return;

    // Validation for simulations
    if (itemType === 'simulation') {
      if (selectedWorkflows.length === 0) {
        setError('Please select at least one workflow');
        return;
      }
    }

    // Check nesting limit for folders (max 3 levels: 0, 1, 2, 3)
    if (itemType === 'folder') {
      const currentDepth = getFolderDepth(currentFolder);
      if (currentDepth >= 3) {
        setError('Maximum nesting level reached. You can only create folders up to 3 levels deep.');
        return;
      }
    }

    const baseItem = {
      id: Date.now().toString(),
      name: name.trim(),
      type: itemType,
      stage: itemType === 'simulation' ? 'draft' : stage, // Simulations always go to draft
      createdBy: 'Shubham Bhatt',
      lastUpdated: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      lastUpdatedBy: 'Shubham Bhatt',
      parentId: itemType === 'simulation' ? null : currentFolder, // Simulations are top-level
    };

    let newItem: Item;
    if (itemType === 'workflow') {
      newItem = {
        ...baseItem,
        type: 'workflow',
        screenCount: 0,
      } as Workflow;
    } else if (itemType === 'simulation') {
      newItem = {
        ...baseItem,
        type: 'simulation',
        workflowCount: selectedWorkflows.length,
        hasAssessment: false,
        playgroundMode: playgroundMode,
        selectedWorkflows: selectedWorkflows,
      } as Simulation;
    } else {
      newItem = {
        ...baseItem,
        type: 'folder',
        children: [],
      } as Folder;
    }

    addItem(newItem);
    setName('');
    setError('');
    setSelectedWorkflows([]);
    onClose();
  };

  const getTitle = () => {
    switch (itemType) {
      case 'workflow':
        return 'Create workflow';
      case 'simulation':
        return 'Create simulation';
      case 'folder':
        return 'Create folder';
    }
  };

  const toggleWorkflowSelection = (workflowId: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(workflowId)
        ? prev.filter(id => id !== workflowId)
        : [...prev, workflowId]
    );
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
        className="bg-white rounded-lg w-full max-w-md shadow-xl" 
        style={{ padding: '24px' }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
          <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
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
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder={`Enter ${itemType} name`}
            className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            style={{ 
              padding: '10px 12px', 
              fontSize: '14px',
              borderColor: error ? '#dc2626' : undefined
            }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
              if (e.key === 'Escape') onClose();
            }}
          />
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>

        {/* Workflow selection for simulations */}
        {itemType === 'simulation' && (
          <div style={{ marginBottom: '24px' }}>
            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
              Select workflows
            </label>
            {availableWorkflows.length === 0 ? (
              <p className="text-sm text-gray-500">No workflows available. Please create a workflow first.</p>
            ) : (
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto', 
                border: '1px solid #e2e8f0', 
                borderRadius: '6px',
                padding: '8px'
              }}>
                {availableWorkflows.map((workflow) => (
                  <label
                    key={workflow.id}
                    className="flex items-center gap-3 cursor-pointer"
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      marginBottom: '4px',
                      backgroundColor: selectedWorkflows.includes(workflow.id) ? '#eff6ff' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedWorkflows.includes(workflow.id)) {
                        e.currentTarget.style.backgroundColor = '#f7fafc';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedWorkflows.includes(workflow.id)) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedWorkflows.includes(workflow.id)}
                      onChange={() => toggleWorkflowSelection(workflow.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{workflow.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Playground mode toggle for simulations */}
        {itemType === 'simulation' && (
          <div style={{ marginBottom: '24px' }}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={playgroundMode}
                onChange={(e) => setPlaygroundMode(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Enable playground mode</span>
                <p className="text-xs text-gray-500 mt-1">
                  Links workflows with common screens in this simulation
                </p>
              </div>
            </label>
          </div>
        )}

        <div className="flex justify-end" style={{ gap: '12px' }}>
          <button
            onClick={onClose}
            className="text-gray-700 hover:bg-gray-100 rounded-md"
            style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || (itemType === 'simulation' && selectedWorkflows.length === 0)}
            className="bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

