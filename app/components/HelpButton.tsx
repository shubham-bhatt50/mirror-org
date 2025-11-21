'use client';

import { useState } from 'react';
import { IconHelp, IconX, IconKeyboard } from '@tabler/icons-react';

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'Esc', action: 'Close modal or menu' },
    { key: 'Enter', action: 'Confirm action in modal' },
    { key: 'Click folder', action: 'Navigate into folder' },
    { key: 'Breadcrumbs', action: 'Navigate back to parent' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center z-40 transition-transform hover:scale-110"
        title="Help"
      >
        <IconHelp size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <IconKeyboard size={24} className="text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Quick help
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Key Features
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Create nested folders for better organization</li>
                  <li>• Switch between Draft and Production stages</li>
                  <li>• Search items by name</li>
                  <li>• Use breadcrumbs to navigate folder hierarchy</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{shortcut.action}</span>
                      <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono text-gray-700">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  This is a prototype for testing nested folder organization and
                  streamlined workflow stages in Whatfix Mirror.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

