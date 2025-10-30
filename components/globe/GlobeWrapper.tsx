'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import Globe3D with no SSR
const Globe3D = dynamic(() => import('./Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-slate-900 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-blue-400">Loading 3D Globe...</p>
      </div>
    </div>
  )
});

interface GlobeWrapperProps {
  conflicts: any[];
  environmentData: any[];
  showCities?: boolean;
  showCountryLabels?: boolean;
}

export default function GlobeWrapper(props: GlobeWrapperProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[600px] bg-slate-900 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-400">Initializing 3D Globe...</p>
        </div>
      </div>
    }>
      <Globe3D {...props} />
    </Suspense>
  );
}