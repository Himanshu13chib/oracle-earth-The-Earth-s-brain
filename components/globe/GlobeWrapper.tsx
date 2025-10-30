'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dynamically import Globe3D with no SSR
const Globe3D = dynamic(() => import('./Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-slate-900 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-blue-400">Loading 3D Globe...</p>
        <p className="text-gray-400 text-sm mt-2">Initializing Three.js renderer...</p>
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
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-slate-900 rounded-lg border border-slate-700">
        <div className="text-center p-8">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">3D Globe Unavailable</h3>
          <p className="text-gray-400 mb-4 max-w-md">
            The 3D globe couldn't load. This might be due to WebGL compatibility issues or browser limitations.
          </p>
          <div className="space-y-2">
            <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <p className="text-xs text-gray-500">
              Try refreshing the page or using a different browser
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[600px] bg-slate-900 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-400">Initializing 3D Globe...</p>
          <p className="text-gray-400 text-sm mt-2">Loading Three.js components...</p>
        </div>
      </div>
    }>
      <div key={retryCount}>
        <Globe3D 
          {...props} 
          onError={() => setHasError(true)}
        />
      </div>
    </Suspense>
  );
}