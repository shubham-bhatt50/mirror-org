'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import WorkflowsTable from './components/WorkflowsTable';
import ContentDetail from './components/ContentDetail';
import HelpButton from './components/HelpButton';
import { ItemsProvider, useItems } from './context/ItemsContext';
import { IconPlus, IconSearch, IconFilter, IconLayoutGrid, IconChevronRight } from '@tabler/icons-react';
import { Stage, ItemType } from './types';
import styles from './components/Dashboard.module.css';

function ContentArea() {
  const { selectedContent, setSelectedContent, breadcrumbs, setCurrentFolder } = useItems();
  const [activeTab, setActiveTab] = useState<Stage>('draft');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [createItemType, setCreateItemType] = useState<ItemType>('workflow');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
        setShowCreateMenu(false);
      }
    };

    if (showCreateMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCreateMenu]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
        setShowCreateMenu(false);
      }
    };

    if (showCreateMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCreateMenu]);

  // If content is selected, show detail view
  if (selectedContent && (selectedContent.type === 'workflow' || selectedContent.type === 'simulation')) {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f7fafc' }}>
        <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ContentDetail 
            item={selectedContent} 
            onBack={() => setSelectedContent(null)} 
          />
        </div>
        <HelpButton />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f7fafc' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Breadcrumbs - Only show when inside folders */}
        {breadcrumbs.length > 1 && (
          <div className={styles.breadcrumbs}>
            <div className={styles.breadcrumbContainer}>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.id || 'root'} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {index > 0 && <IconChevronRight size={16} style={{ color: '#a0aec0' }} />}
                  <button
                    onClick={() => setCurrentFolder(crumb.id)}
                    className={`${styles.breadcrumbItem} ${
                      index === breadcrumbs.length - 1 ? styles.breadcrumbItemActive : ''
                    }`}
                  >
                    {crumb.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Content</h1>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              onClick={() => {
                setActiveTab('draft');
                setCurrentFolder(null);
                setSelectedContent(null);
              }}
              className={`${styles.tab} ${activeTab === 'draft' ? styles.tabActive : ''}`}
            >
              Draft
            </button>
            <button
              onClick={() => {
                setActiveTab('production');
                setCurrentFolder(null);
                setSelectedContent(null);
              }}
              className={`${styles.tab} ${activeTab === 'production' ? styles.tabActive : ''}`}
            >
              Production
            </button>
            
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div ref={createMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className={styles.createButton}
                >
                  <IconPlus size={18} />
                  Create new
                </button>
                {showCreateMenu && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '8px',
                    width: '192px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: 100,
                    border: '1px solid #e2e8f0'
                  }}>
                    <button
                      onClick={() => {
                        setCreateItemType('folder');
                        setIsCreateModalOpen(true);
                        setShowCreateMenu(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 16px',
                        fontSize: '14px',
                        color: '#4a5568',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Create folder
                    </button>
                    <button
                      onClick={() => {
                        setCreateItemType('workflow');
                        setIsCreateModalOpen(true);
                        setShowCreateMenu(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 16px',
                        fontSize: '14px',
                        color: '#4a5568',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Create content
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.searchContainer}>
                <IconSearch size={20} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <button className={styles.filterButton}>
                <IconFilter size={18} />
                Filter
              </button>
              <button className={styles.gridButton}>
                <IconLayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <WorkflowsTable 
          stage={activeTab} 
          searchTerm={searchTerm}
          createItemType={createItemType}
          isCreateModalOpen={isCreateModalOpen}
          onCloseCreateModal={() => setIsCreateModalOpen(false)}
        />
      </div>

      {/* Help Button */}
      <HelpButton />
    </div>
  );
}

export default function Home() {
  return (
    <ItemsProvider>
      <ContentArea />
    </ItemsProvider>
  );
}
