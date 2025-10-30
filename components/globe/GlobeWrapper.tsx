'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ErrorBoundary from '@/components/ErrorBoundary';
import SimpleGlobe from './SimpleGlobe';
import { isWebGLSupported, isThreeJSCompatible } from '@/lib/webgl-utils';

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
  const [use3D, setUse3D] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if WebGL and Three.js are supported
    if (!isWebGLSupported() || !isThreeJSCompatible()) {
      setUse3D(false);
    }
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setRetryCount(prev => prev + 1);
    setUse3D(true);
  };

  const handleUse2D = () => {
    setUse3D(false);
    setHasError(false);
  };

  // Show simple globe if not using 3D or if there's an error
  if (!isClient || !use3D || hasError) {
    return (
      <div className="space-y-4">
        {hasError && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">3D Globe Failed to Load</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Showing 2D visualization instead. This might be due to WebGL compatibility or browser limitations.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleRetry} size="sm" variant="outline" className="text-xs">
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry 3D
              </Button>
              <Button onClick={handleUse2D} size="sm" variant="outline" className="text-xs">
                Continue with 2D
              </Button>
            </div>
          </div>
        )}
        <SimpleGlobe {...props} />
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
        <ErrorBoundary onError={() => setHasError(true)}>
          <Globe3D {...props} />
        </ErrorBoundary>
      </div>
    </Suspense>
  );
}