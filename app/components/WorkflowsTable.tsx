'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  IconX,
  IconTrash,
  IconSend,
} from '@tabler/icons-react';
import { Stage, ItemType } from '../types';
import { useItems } from '../context/ItemsContext';
import ItemRow from './ItemRow';
import CreateItemModal from './CreateItemModal';
import EmptyState from './EmptyState';
import styles from './Dashboard.module.css';

interface WorkflowsTableProps {
  stage: Stage;
  searchTerm?: string;
  createItemType?: ItemType;
  isCreateModalOpen?: boolean;
  onCloseCreateModal?: () => void;
}

export default function WorkflowsTable({ 
  stage, 
  searchTerm: externalSearchTerm = '',
  createItemType: externalCreateItemType = 'workflow',
  isCreateModalOpen: externalIsModalOpen = false,
  onCloseCreateModal
}: WorkflowsTableProps) {
  const { items, currentFolder, updateItem, deleteItem } = useItems();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [localCreateItemType, setLocalCreateItemType] = useState<ItemType>('folder');
  const [localIsModalOpen, setLocalIsModalOpen] = useState(false);
  
  const searchTerm = externalSearchTerm;
  const createItemType = externalCreateItemType;
  // Use external modal state if provided, otherwise use local state
  const isModalOpen = externalIsModalOpen || localIsModalOpen;

  // Filter items based on current folder and stage, then sort by ID (newest first)
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesStage = item.stage === stage;
        const matchesParent = item.parentId === currentFolder;
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        // In production mode, only show workflows and simulations (no folders)
        const matchesType = stage === 'production' 
          ? (item.type === 'workflow' || item.type === 'simulation')
          : true;
        return matchesStage && matchesParent && matchesSearch && matchesType;
      })
      .sort((a, b) => {
        // Sort by ID descending (newest items first, since IDs are timestamps)
        return parseInt(b.id) - parseInt(a.id);
      });
  }, [items, currentFolder, stage, searchTerm]);


  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleItemSelect = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
  };

  const handlePublish = () => {
    selectedItems.forEach(itemId => {
      updateItem(itemId, { stage: 'production' });
    });
    setSelectedItems(new Set());
  };

  const handleDeleteSelected = () => {
    if (confirm(`Are you sure you want to delete ${selectedItems.size} item(s)?`)) {
      selectedItems.forEach(itemId => {
        deleteItem(itemId);
      });
      setSelectedItems(new Set());
    }
  };

  const isAllSelected = filteredItems.length > 0 && selectedItems.size === filteredItems.length;
  const isIndeterminate = selectedItems.size > 0 && selectedItems.size < filteredItems.length;

  // Clear selection when filtered items change (e.g., tab switch, search)
  useEffect(() => {
    const filteredIds = new Set(filteredItems.map(item => item.id));
    setSelectedItems(prev => {
      const newSelected = new Set(
        Array.from(prev).filter(id => filteredIds.has(id))
      );
      return newSelected;
    });
  }, [filteredItems]);

  const handleCreateClick = (type: ItemType) => {
    setLocalCreateItemType(type);
    setLocalIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setLocalIsModalOpen(false);
    onCloseCreateModal?.();
  };

  return (
    <div className={styles.dashboard}>
      {/* Selection Action Bar - Show when items are selected */}
      {selectedItems.size > 0 && (
        <div className={styles.selectionBar}>
          <div className={styles.selectionBarLeft}>
            <div className={styles.selectedBadge}>
              <span>{selectedItems.size} selected</span>
              <button
                onClick={handleDeselectAll}
                className={styles.deselectButton}
              >
                <IconX size={16} />
              </button>
            </div>
            <button
              onClick={handlePublish}
              className={styles.publishButton}
            >
              <IconSend size={18} />
              Publish
            </button>
            <button
              onClick={handleDeleteSelected}
              className={styles.deleteButton}
            >
              <IconTrash size={18} />
              Delete
            </button>
          </div>
        </div>
      )}


      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className={styles.tableHeaderCell}>Name ↕</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>Created by</th>
              <th className={styles.tableHeaderCell}>Last updated ⇅</th>
              <th className={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 0 }}>
                  <EmptyState
                    type={searchTerm ? 'search' : 'empty'}
                    onCreateClick={
                      searchTerm ? undefined : () => handleCreateClick('folder')
                    }
                  />
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onSelect={(checked) => handleItemSelect(item.id, checked)}
                  stage={stage}
                  allItems={items}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredItems.length > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Rows 1-{filteredItems.length} of {filteredItems.length}
          </div>
          <div className={styles.paginationControls}>
            <button className={styles.paginationButton}>←</button>
            <button className={`${styles.paginationButton} ${styles.paginationButtonActive}`}>1</button>
            <button className={styles.paginationButton}>→</button>
          </div>
        </div>
      )}

      <CreateItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        itemType={externalIsModalOpen ? createItemType : localCreateItemType}
        stage={stage}
      />
    </div>
  );
}

