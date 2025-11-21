'use client';

import { IconFolder, IconFile, IconLayoutGrid } from '@tabler/icons-react';

interface EmptyStateProps {
  type: 'search' | 'empty';
  onCreateClick?: () => void;
}

export default function EmptyState({ type, onCreateClick }: EmptyStateProps) {
  if (type === 'search') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <IconFolder size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No items found
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Try adjusting your search to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <IconFolder size={24} className="text-blue-500" />
        </div>
        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
          <IconFile size={24} className="text-green-500" />
        </div>
        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
          <IconLayoutGrid size={24} className="text-purple-500" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        Get started by creating your first item
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-4">
        Create folders to organize your content, content items for individual flows,
        or folders to group multiple content items together.
      </p>
      {onCreateClick && (
        <button
          onClick={onCreateClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
        >
          Create your first item
        </button>
      )}
    </div>
  );
}

