'use client';

import {
  IconFolder,
  IconLayoutGrid,
  IconChevronRight,
  IconTrash,
  IconEdit,
  IconSettings,
  IconCheck,
} from '@tabler/icons-react';
import { Item } from '../types';
import { useItems } from '../context/ItemsContext';
import { useState, useRef, useEffect } from 'react';
import styles from './Dashboard.module.css';
import ConfigureFolderModal from './ConfigureFolderModal';
import RenameModal from './RenameModal';

interface ItemRowProps {
  item: Item;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  stage?: 'draft' | 'production';
  allItems?: Item[];
}

export default function ItemRow({ item, isSelected = false, onSelect, stage = 'draft', allItems = [] }: ItemRowProps) {
  const { setCurrentFolder, deleteItem, setSelectedContent, updateItem, getFolderDepth, getEffectivePlaygroundMode } = useItems();
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [dropError, setDropError] = useState('');
  const justDraggedRef = useRef(false);

  // Calculate how many items are inside this folder
  const getFolderItemCount = () => {
    if (item.type !== 'folder') return 0;
    return allItems.filter(i => i.parentId === item.id).length;
  };

  const folderItemCount = getFolderItemCount();

  const getIcon = () => {
    switch (item.type) {
      case 'folder':
        return <IconFolder size={20} className="text-gray-600" />;
      case 'workflow':
        return <IconLayoutGrid size={20} className="text-gray-600" />;
      case 'simulation':
        return <IconFolder size={20} className="text-gray-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'folder':
        return 'Folder';
      case 'workflow':
        return 'Workflow';
      case 'simulation':
        return 'Folder';
    }
  };

  const handleRowClick = () => {
    // Don't navigate if we just finished dragging
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    // Don't navigate if any modal is open
    if (showRenameModal || showConfigureModal) {
      return;
    }
    if (item.type === 'folder') {
      setCurrentFolder(item.id);
    } else if (item.type === 'workflow' || item.type === 'simulation') {
      setSelectedContent(item);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to archive "${item.name}"?`)) {
      deleteItem(item.id);
    }
  };

  // Check if dropping item into target would create a circular reference
  const wouldCreateCircularReference = (draggedId: string, targetId: string): boolean => {
    if (draggedId === targetId) return true;
    
    // Check if target is a child of dragged item
    const findParent = (id: string): string | null => {
      const foundItem = allItems.find(i => i.id === id);
      return foundItem?.parentId || null;
    };

    let currentParent = findParent(targetId);
    while (currentParent) {
      if (currentParent === draggedId) return true;
      currentParent = findParent(currentParent);
    }
    return false;
  };

  // Check if moving a folder (and all its children) would exceed nesting limit
  const wouldExceedNestingLimit = (draggedId: string, targetId: string): boolean => {
    const draggedItem = allItems.find(i => i.id === draggedId);
    if (!draggedItem || draggedItem.type !== 'folder') return false;

    const targetDepth = getFolderDepth(targetId);
    if (targetDepth >= 3) return true; // Target is already at max depth

    // Calculate what the depth would be after moving
    // The dragged folder would be at targetDepth + 1
    const newDraggedDepth = targetDepth + 1;
    if (newDraggedDepth > 3) return true;

    // Check the maximum depth in the dragged folder's tree after the move
    const getMaxDepthInTree = (folderId: string, currentDepth: number): number => {
      if (currentDepth > 3) return currentDepth; // Already exceeded, no need to check further
      
      const children = allItems.filter(i => i.parentId === folderId);
      if (children.length === 0) return currentDepth;

      let maxDepth = currentDepth;
      children.forEach(child => {
        if (child.type === 'folder') {
          const childDepth = getMaxDepthInTree(child.id, currentDepth + 1);
          maxDepth = Math.max(maxDepth, childDepth);
        } else {
          // Non-folder items don't contribute to depth
          maxDepth = Math.max(maxDepth, currentDepth);
        }
      });
      return maxDepth;
    };

    // Calculate what the maximum depth would be after moving
    const draggedTreeMaxDepth = getMaxDepthInTree(draggedId, newDraggedDepth);
    return draggedTreeMaxDepth > 3;
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (stage !== 'draft') {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
    setDraggedItemId(item.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    setDraggedItemId(null);
    setDropError('');
    // Prevent click event after drag
    justDraggedRef.current = true;
    setTimeout(() => {
      justDraggedRef.current = false;
    }, 100);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (stage !== 'draft' || item.type !== 'folder') {
      return;
    }

    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === item.id) {
      return;
    }

    // Check for circular reference
    if (wouldCreateCircularReference(draggedId, item.id)) {
      e.preventDefault();
      setDropError('');
      return;
    }

    // Check if dropping would exceed nesting limit
    if (wouldExceedNestingLimit(draggedId, item.id)) {
      e.preventDefault();
      setDropError('Maximum nesting level reached');
      return;
    }

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    setDropError('');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're actually leaving the row
    // Check if we're moving to a child element
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && e.currentTarget.contains(relatedTarget)) {
      return; // Still within the row, don't clear
    }
    setIsDragOver(false);
    setDropError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDropError('');

    if (stage !== 'draft' || item.type !== 'folder') {
      return;
    }

    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === item.id) {
      return;
    }

    // Check for circular reference
    if (wouldCreateCircularReference(draggedId, item.id)) {
      return;
    }

    // Check if dropping would exceed nesting limit
    if (wouldExceedNestingLimit(draggedId, item.id)) {
      setDropError('Maximum nesting level reached. You can only create folders up to 3 levels deep.');
      return;
    }

    // Update the parentId and lastUpdated of the dragged item
    updateItem(draggedId, { 
      parentId: item.id,
      lastUpdated: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      lastUpdatedBy: 'Shubham Bhatt'
    });
    setDraggedItemId(null);
  };


  const isDragEnabled = stage === 'draft';
  const isDropTarget = item.type === 'folder' && isDragEnabled;

  return (
    <tr 
      className={`${styles.tableRow} ${isDragging ? styles.dragging : ''} ${isDragOver ? styles.dragOver : ''} ${isDragEnabled ? styles.draggable : ''}`}
      onClick={handleRowClick}
      draggable={isDragEnabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={isDropTarget ? handleDragOver : undefined}
      onDragLeave={isDropTarget ? handleDragLeave : undefined}
      onDrop={isDropTarget ? handleDrop : undefined}
    >
      <td className={styles.tableCell}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect?.(e.target.checked);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      <td className={styles.tableCell}>
        <div className={styles.tableCellName}>
          <div className={styles.itemIcon}>{getIcon()}</div>
          <span className={styles.itemName}>{item.name}</span>
          {item.type === 'workflow' && 'screenCount' in item && (
            <span className={styles.badge}>{item.screenCount}</span>
          )}
          {item.type === 'workflow' && 'hasFlow' in item && item.hasFlow && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '11px',
              padding: '2px 6px 2px 3px',
              borderRadius: '12px',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              fontWeight: '500',
              marginLeft: '4px'
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#1e40af',
                color: 'white',
              }}>
                <IconCheck size={8} />
              </span>
              Flow
            </span>
          )}
          {item.type === 'simulation' && 'workflowCount' in item && (
            <span className={styles.badge}>{item.workflowCount}</span>
          )}
          {item.type === 'simulation' && 'hasAssessment' in item && item.hasAssessment && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '11px',
              padding: '2px 6px 2px 3px',
              borderRadius: '12px',
              backgroundColor: '#f3e8ff',
              color: '#7c3aed',
              fontWeight: '500',
              marginLeft: '4px'
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#7c3aed',
                color: 'white',
              }}>
                <IconCheck size={8} />
              </span>
              Assessment added
            </span>
          )}
          {item.type === 'folder' && (
            <>
              {folderItemCount > 0 && (
                <span className={styles.badge}>{folderItemCount}</span>
              )}
              {(() => {
                const folder = item as import('../types').Folder;
                const effectiveMode = getEffectivePlaygroundMode(item.id);
                const isExplicit = folder.playgroundMode !== null && folder.playgroundMode !== undefined;
                if (effectiveMode || isExplicit) {
                  return (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '11px',
                      padding: '2px 6px 2px 3px',
                      borderRadius: '12px',
                      backgroundColor: effectiveMode ? '#fef3c7' : '#f3f4f6',
                      color: effectiveMode ? '#d97706' : '#6b7280',
                      fontWeight: '500',
                      marginLeft: '4px'
                    }}>
                      {effectiveMode && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: '#d97706',
                          color: 'white',
                        }}>
                          <IconCheck size={8} />
                        </span>
                      )}
                      {effectiveMode ? 'Playground' : 'Playground off'}
                      {!isExplicit && ' (inherited)'}
                    </span>
                  );
                }
                return null;
              })()}
              {isDragOver && !dropError && (
                <span style={{ 
                  marginLeft: 'auto', 
                  marginRight: '8px',
                  fontSize: '12px',
                  color: '#3b82f6',
                  fontWeight: '600'
                }}>
                  Drop here
                </span>
              )}
              {dropError && (
                <span style={{ 
                  marginLeft: 'auto', 
                  marginRight: '8px',
                  fontSize: '12px',
                  color: '#dc2626',
                  fontWeight: '600'
                }}>
                  {dropError}
                </span>
              )}
              <IconChevronRight size={16} style={{ color: '#a0aec0', marginLeft: isDragOver || dropError ? '0' : 'auto' }} />
            </>
          )}
        </div>
      </td>
      <td className={styles.tableCell}>{getTypeLabel()}</td>
      <td className={styles.tableCell}>{item.createdBy}</td>
      <td className={styles.tableCell}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span>{item.lastUpdated}</span>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>by {item.lastUpdatedBy}</span>
        </div>
      </td>
      <td className={`${styles.tableCell} ${styles.actionsCell}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowRenameModal(true);
            }}
            style={{
              padding: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#4a5568',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Edit"
          >
            <IconEdit size={18} />
          </button>
          {item.type === 'folder' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfigureModal(true);
              }}
              style={{
                padding: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#4a5568',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Configure"
            >
              <IconSettings size={18} />
            </button>
          )}
          <button
            onClick={handleDelete}
            style={{
              padding: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Archive"
          >
            <IconTrash size={18} />
          </button>
        </div>
      </td>

      <RenameModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        item={item}
      />
      {item.type === 'folder' && (
        <ConfigureFolderModal
          isOpen={showConfigureModal}
          onClose={() => setShowConfigureModal(false)}
          folder={item as import('../types').Folder}
        />
      )}
    </tr>
  );
}

