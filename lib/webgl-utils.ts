// WebGL detection and compatibility utilities

export function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

export function getWebGLInfo(): { supported: boolean; renderer?: string; vendor?: string; version?: string } {
  if (typeof window === 'undefined') {
    return { supported: false };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { supported: false };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    return {
      supported: true,
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
      version: gl.getParameter(gl.VERSION)
    };
  } catch (e) {
    return { supported: false };
  }
}

export function isThreeJSCompatible(): boolean {
  if (!isWebGLSupported()) return false;
  
  // Check for other required features
  try {
    // Check for Float32Array support
    if (typeof Float32Array === 'undefined') return false;
    
    // Check for requestAnimationFrame
    if (typeof requestAnimationFrame === 'undefined') return false;
    
    return true;
  } catch (e) {
    return false;
  }
}