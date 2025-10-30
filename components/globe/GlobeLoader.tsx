'use client';

import { RefreshCw } from 'lucide-react';

export default function GlobeLoader() {
  return (
    <div className="w-full h-[600px] bg-black rounded-lg flex items-center justify-center">
      <div className="text-center text-white">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-lg">Loading 3D Globe...</p>
        <p className="text-sm text-gray-400 mt-2">Initializing global intelligence visualization</p>
      </div>
    </div>
  );
}