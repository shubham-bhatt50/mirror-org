'use client';

import { useState, useMemo } from 'react';
import { IconChevronLeft, IconChevronRight, IconEye, IconShare, IconExternalLink, IconCheck } from '@tabler/icons-react';
import { Item, Stage } from '../types';
import { useItems } from '../context/ItemsContext';
import styles from './ContentDetail.module.css';
import ShareModal from './ShareModal';

interface ContentDetailProps {
  item: Item;
  onBack: () => void;
}

export default function ContentDetail({ item, onBack }: ContentDetailProps) {
  const { updateItem, items, setCurrentFolder, setSelectedContent } = useItems();
  const [currentPage, setCurrentPage] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);

  // Mock screen data - in real app this would come from the item
  const screens = (item.type === 'workflow' || item.type === 'simulation') && 'screenCount' in item && item.screenCount > 0
    ? Array.from({ length: item.screenCount }, (_, i) => ({
        id: `${item.id}-screen-${i + 1}`,
        title: `Capture ${i + 1}`,
        description: i === 0 ? 'Click on cta link' : i === 1 ? 'Google Store: Exclusive Google P...' : 'Click on Free open wiki software...',
        thumbnail: `https://picsum.photos/300/200?random=${i + 1}`,
      }))
    : (item.type === 'workflow' || item.type === 'simulation')
    ? [
        { id: '1', title: 'Capture 1', description: 'Click on cta link', thumbnail: 'https://picsum.photos/300/200?random=1' },
        { id: '2', title: 'Capture 2', description: 'Google Store: Exclusive Google P...', thumbnail: 'https://picsum.photos/300/200?random=2' },
        { id: '3', title: 'Capture 3', description: 'Click on Free open wiki software...', thumbnail: 'https://picsum.photos/300/200?random=3' },
      ]
    : [];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(screens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleScreens = screens.slice(startIndex, startIndex + itemsPerPage);

  // Calculate breadcrumbs for the current item
  const breadcrumbs = useMemo(() => {
    const crumbs: { id: string | null; name: string }[] = [
      { id: null, name: 'Content' },
    ];
    
    if (item.parentId) {
      const findPath = (
        id: string,
        allItems: Item[]
      ): { id: string; name: string }[] | null => {
        const folderItem = allItems.find((i) => i.id === id);
        if (!folderItem) return null;

        if (folderItem.parentId === null) {
          return [{ id: folderItem.id, name: folderItem.name }];
        }

        const parentPath = findPath(folderItem.parentId, allItems);
        if (parentPath) {
          return [...parentPath, { id: folderItem.id, name: folderItem.name }];
        }
        return null;
      };

      const path = findPath(item.parentId, items);
      if (path) {
        crumbs.push(...path);
      }
    }
    
    // Add the current item at the end
    crumbs.push({ id: item.id, name: item.name });
    
    return crumbs;
  }, [item, items]);

  const handleBreadcrumbClick = (crumbId: string | null) => {
    if (crumbId === null) {
      // Navigate to root
      setSelectedContent(null);
      setCurrentFolder(null);
    } else {
      const clickedItem = items.find(i => i.id === crumbId);
      if (clickedItem) {
        if (clickedItem.type === 'folder') {
          // Navigate to folder
          setSelectedContent(null);
          setCurrentFolder(clickedItem.id);
        } else {
          // Navigate to item detail
          setSelectedContent(clickedItem);
          setCurrentFolder(clickedItem.parentId);
        }
      }
    }
  };

  return (
    <div className={styles.detailContainer}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id || 'root'} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {index > 0 && <IconChevronRight size={16} style={{ color: '#a0aec0' }} />}
              {index === breadcrumbs.length - 1 ? (
                <span className={styles.breadcrumbCurrent}>{crumb.name}</span>
              ) : (
                <button
                  onClick={() => handleBreadcrumbClick(crumb.id)}
                  className={styles.breadcrumbItem}
                >
                  {crumb.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconContainer}>
            <div className={styles.contentIcon}>DO</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 className={styles.title}>{item.name}</h1>
            {item.type === 'workflow' && 'hasFlow' in item && item.hasFlow && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Navigate to flow link when available
                  window.open('#', '_blank');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  padding: '4px 8px 4px 4px',
                  borderRadius: '12px',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  fontWeight: '500',
                  textDecoration: 'none',
                  width: 'fit-content',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#bfdbfe';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dbeafe';
                }}
              >
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#1e40af',
                  color: 'white',
                }}>
                  <IconCheck size={10} />
                </span>
                Flow available
                <IconExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
        <div className={styles.headerRight}>
          {item.stage === 'draft' ? (
            <button className={styles.previewButton}>
              <IconEye size={18} />
              Preview
            </button>
          ) : (
            <button 
              className={styles.shareButton}
              onClick={() => setShowShareModal(true)}
            >
              <IconShare size={18} />
              Share
            </button>
          )}
        </div>
      </div>

      {/* Screens Grid */}
      <div className={styles.screensContainer}>
        {screens.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No screens added yet. Add screens to build your workflow.</p>
          </div>
        ) : (
          <>
            <div className={styles.screensGrid}>
              {visibleScreens.map((screen, index) => {
                const globalIndex = startIndex + index;
                const isLastInAll = globalIndex === screens.length - 1;
                return (
                  <div key={screen.id} className={styles.screenCard}>
                    <div className={styles.screenThumbnail}>
                      <img src={screen.thumbnail} alt={screen.title} />
                    </div>
                    <div className={styles.screenInfo}>
                      <h3 className={styles.screenTitle}>{screen.title}</h3>
                      <p className={styles.screenDescription}>{screen.description}</p>
                    </div>
                    {!isLastInAll && (
                      <div className={styles.connector}>
                        <div className={styles.connectorLine}></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <div className={styles.paginationInfo}>
                  Screens {startIndex + 1}-{Math.min(startIndex + itemsPerPage, screens.length)} of {screens.length}
                </div>
                <div className={styles.paginationControls}>
                  <button className={`${styles.paginationButton} ${styles.paginationButtonActive}`}>
                    {currentPage}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        item={item}
      />
    </div>
  );
}

