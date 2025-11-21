'use client';

import Sidebar from '../components/Sidebar';
import { ItemsProvider } from '../context/ItemsContext';

export default function Settings() {
  return (
    <ItemsProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-gray-600">Settings page coming soon...</p>
          </div>
        </div>
      </div>
    </ItemsProvider>
  );
}

