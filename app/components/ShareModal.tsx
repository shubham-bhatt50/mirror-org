'use client';

import { useState, useEffect, useRef } from 'react';
import { IconX, IconCopy, IconMail, IconLink, IconCheck } from '@tabler/icons-react';
import { Item } from '../types';
import { useItems } from '../context/ItemsContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
}

export default function ShareModal({ isOpen, onClose, item }: ShareModalProps) {
  const { items } = useItems();
  const [shareLink, setShareLink] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareMode, setShareMode] = useState<'link' | 'email'>('link');
  const modalRef = useRef<HTMLDivElement>(null);

  // Generate share link
  useEffect(() => {
    if (isOpen && item) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const link = `${baseUrl}/share/${item.id}`;
      setShareLink(link);
    }
  }, [isOpen, item]);

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

  // Get all items that will be shared (folder and its contents, only production items)
  const getSharedItems = (): Item[] => {
    if (item.type !== 'folder') {
      return [item];
    }

    const getChildren = (parentId: string): Item[] => {
      const children = items.filter(i => i.parentId === parentId && i.stage === 'production');
      const allChildren: Item[] = [];
      
      children.forEach(child => {
        allChildren.push(child);
        if (child.type === 'folder') {
          allChildren.push(...getChildren(child.id));
        }
      });
      
      return allChildren;
    };

    return [item, ...getChildren(item.id)];
  };

  const sharedItems = getSharedItems();
  const folderCount = sharedItems.filter(i => i.type === 'folder').length;
  const workflowCount = sharedItems.filter(i => i.type === 'workflow').length;
  const simulationCount = sharedItems.filter(i => i.type === 'simulation').length;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(`Shared: ${item.name}`);
    const body = encodeURIComponent(
      `You've been shared access to "${item.name}" from Acme corp.\n\n` +
      `Access it here: ${shareLink}\n\n` +
      `This includes:\n` +
      `- ${folderCount} folder(s)\n` +
      `- ${workflowCount} workflow(s)\n` +
      `- ${simulationCount} simulation(s)`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
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
        style={{ padding: '24px', maxHeight: '90vh', overflow: 'auto' }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
          <h2 className="text-xl font-semibold text-gray-800">Share {item.type === 'folder' ? 'folder' : 'content'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            style={{ padding: '4px' }}
          >
            <IconX size={20} />
          </button>
        </div>

        {/* What's being shared */}
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
          <h3 className="text-sm font-medium text-gray-700" style={{ marginBottom: '12px' }}>What will be shared:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="text-sm text-gray-600" style={{ fontWeight: '500' }}>{item.name}</span>
              <span className="text-xs text-gray-500">({item.type})</span>
            </div>
            {item.type === 'folder' && (
              <div style={{ marginLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="text-xs text-gray-600">
                  • {folderCount} folder(s)
                </div>
                <div className="text-xs text-gray-600">
                  • {workflowCount} workflow(s)
                </div>
                <div className="text-xs text-gray-600">
                  • {simulationCount} simulation(s)
                </div>
                <div className="text-xs text-gray-500" style={{ marginTop: '4px', fontStyle: 'italic' }}>
                  Only production items will be shared
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Share mode tabs */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setShareMode('link')}
            style={{
              padding: '8px 16px',
              borderBottom: shareMode === 'link' ? '2px solid #3b82f6' : '2px solid transparent',
              color: shareMode === 'link' ? '#3b82f6' : '#718096',
              fontWeight: shareMode === 'link' ? '500' : '400',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <IconLink size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Share link
          </button>
          <button
            onClick={() => setShareMode('email')}
            style={{
              padding: '8px 16px',
              borderBottom: shareMode === 'email' ? '2px solid #3b82f6' : '2px solid transparent',
              color: shareMode === 'email' ? '#3b82f6' : '#718096',
              fontWeight: shareMode === 'email' ? '500' : '400',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <IconMail size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Share via email
          </button>
        </div>

        {/* Share link section */}
        {shareMode === 'link' && (
          <div style={{ marginBottom: '24px' }}>
            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
              Share link
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={shareLink}
                readOnly
                className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                style={{ padding: '10px 12px', fontSize: '14px' }}
              />
              <button
                onClick={handleCopyLink}
                className="bg-blue-500 text-white rounded-md hover:bg-blue-600 px-4 flex items-center gap-2"
                style={{ fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap' }}
              >
                {copied ? (
                  <>
                    <IconCheck size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <IconCopy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500" style={{ marginTop: '8px' }}>
              Learners can access this {item.type === 'folder' ? 'folder and all its contents' : 'content'} using this link
            </p>
          </div>
        )}

        {/* Email section */}
        {shareMode === 'email' && (
          <div style={{ marginBottom: '24px' }}>
            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="learner@example.com"
              className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              style={{ padding: '10px 12px', fontSize: '14px', marginBottom: '8px' }}
            />
            <button
              onClick={handleShareViaEmail}
              disabled={!email.trim()}
              className="w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
            >
              Open email client
            </button>
          </div>
        )}

        {/* What learners see */}
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe' }}>
          <h3 className="text-sm font-medium text-blue-900" style={{ marginBottom: '8px' }}>What learners will see:</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#1e40af' }}>
            <li>The {item.type === 'folder' ? 'folder structure and all' : ''} production content</li>
            <li>All workflows and simulations in a clean, organized view</li>
            <li>Ability to navigate through nested folders</li>
            <li>Read-only access (no editing capabilities)</li>
          </ul>
        </div>

        <div className="flex justify-end" style={{ marginTop: '24px', gap: '12px' }}>
          <button
            onClick={onClose}
            className="text-gray-700 hover:bg-gray-100 rounded-md"
            style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '500' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

