import { useState, useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuth';
import { runSupabaseDiagnostics, logDiagnosticResults } from '@/lib/supabase/diagnostics';

// Define type for diagnostics result
interface DiagnosticsResult {
  configStatus: {
    urlValid: boolean;
    keyFormatValid: boolean;
    region?: string;
    availabilityZone?: string;
  };
  connectionTest: {
    success: boolean;
    error: string | null;
    responseTime: number;
  };
  storageCheck: {
    localStorageAvailable: boolean;
  };
}

/**
 * Debug panel for authentication status monitoring
 * Only use in development environments
 */
export function AuthDebugPanel() {
  const auth = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [diagnosticsResult, setDiagnosticsResult] = useState<DiagnosticsResult | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const refreshDiagnostics = async () => {
    const results = await runSupabaseDiagnostics();
    setDiagnosticsResult(results);
    setLastUpdated(new Date());
    logDiagnosticResults(results);
  };
  
  // Auto-refresh every 10 seconds if visible
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      if (isVisible) {
        refreshDiagnostics();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  if (!isVisible) {
    return (
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-md shadow-md text-sm z-50"
        onClick={() => {
          setIsVisible(true);
          refreshDiagnostics();
        }}
      >
        Debug Auth
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-96 max-w-full z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">Auth Debugger</h3>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setIsVisible(false)}
        >
          Close
        </button>
      </div>
      
      <div className="text-xs space-y-2 overflow-auto max-h-[400px]">
        {/* Authentication State */}
        <div className="p-2 border border-gray-200 rounded">
          <h4 className="font-semibold mb-1">Auth Status</h4>
          <div className="grid grid-cols-2 gap-1">
            <span className="text-gray-600">Authenticated:</span>
            <span className={auth.isAuthenticated ? 'text-green-600' : 'text-red-600'}>
              {auth.isAuthenticated ? 'Yes' : 'No'}
            </span>
            
            <span className="text-gray-600">Loading:</span>
            <span>{auth.isLoading ? 'Yes' : 'No'}</span>
            
            <span className="text-gray-600">User ID:</span>
            <span className="truncate">{auth.user?.id || 'None'}</span>
          </div>
        </div>
        
        {/* Circuit Breaker Status */}
        <div className={`p-2 border rounded ${auth.circuitBreakerStatus.isOpen ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <h4 className="font-semibold mb-1">Circuit Breaker</h4>
          <div className="grid grid-cols-2 gap-1">
            <span className="text-gray-600">Status:</span>
            <span className={auth.circuitBreakerStatus.isOpen ? 'text-red-600 font-medium' : 'text-green-600'}>
              {auth.circuitBreakerStatus.isOpen ? 'OPEN' : 'CLOSED'}
            </span>
            
            <span className="text-gray-600">Failures:</span>
            <span>{auth.circuitBreakerStatus.failures}</span>
            
            <span className="text-gray-600">Can Retry:</span>
            <span>{auth.circuitBreakerStatus.canRetry ? 'Yes' : 'No'}</span>
          </div>
          
          {auth.circuitBreakerStatus.isOpen && (
            <button
              className="mt-2 w-full text-center bg-white text-red-600 border border-red-300 rounded px-2 py-1 text-xs"
              onClick={() => auth.resetCircuitBreaker()}
            >
              Reset Circuit Breaker
            </button>
          )}
        </div>
        
        {/* Error Status */}
        {auth.error && (
          <div className="p-2 border border-red-200 bg-red-50 rounded">
            <h4 className="font-semibold mb-1">Current Error</h4>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-gray-600">Message:</span>
              <span className="text-red-600">{auth.error.message}</span>
              
              <span className="text-gray-600">Severity:</span>
              <span>{auth.error.severity}</span>
            </div>
            
            <button
              className="mt-2 w-full text-center bg-white text-gray-600 border border-gray-300 rounded px-2 py-1 text-xs"
              onClick={() => auth.clearError()}
            >
              Clear Error
            </button>
          </div>
        )}
        
        {/* Diagnostic Results */}
        {diagnosticsResult && (
          <div className="p-2 border border-blue-200 bg-blue-50 rounded">
            <h4 className="font-semibold mb-1">
              Diagnostics
              <span className="text-gray-500 ml-2 text-[10px]">
                (Updated: {lastUpdated.toLocaleTimeString()})
              </span>
            </h4>
            
            <div className="grid grid-cols-2 gap-1">
              <span className="text-gray-600">URL Valid:</span>
              <span className={diagnosticsResult.configStatus.urlValid ? 'text-green-600' : 'text-red-600'}>
                {diagnosticsResult.configStatus.urlValid ? 'Yes' : 'No'}
              </span>
              
              <span className="text-gray-600">Key Valid:</span>
              <span className={diagnosticsResult.configStatus.keyFormatValid ? 'text-green-600' : 'text-red-600'}>
                {diagnosticsResult.configStatus.keyFormatValid ? 'Yes' : 'No'}
              </span>
              
              <span className="text-gray-600">Connection:</span>
              <span className={diagnosticsResult.connectionTest.success ? 'text-green-600' : 'text-red-600'}>
                {diagnosticsResult.connectionTest.success ? 'Success' : 'Failed'}
              </span>
              
              {diagnosticsResult.connectionTest.error && (
                <>
                  <span className="text-gray-600">Error:</span>
                  <span className="text-red-600 truncate">{diagnosticsResult.connectionTest.error}</span>
                </>
              )}
              
              <span className="text-gray-600">Region:</span>
              <span>{diagnosticsResult.configStatus.region || 'Unknown'}</span>
              
              {diagnosticsResult.configStatus.availabilityZone && (
                <>
                  <span className="text-gray-600">Zone:</span>
                  <span>{diagnosticsResult.configStatus.availabilityZone}</span>
                </>
              )}
              
              <span className="text-gray-600">Storage:</span>
              <span className={diagnosticsResult.storageCheck.localStorageAvailable ? 'text-green-600' : 'text-red-600'}>
                {diagnosticsResult.storageCheck.localStorageAvailable ? 'Available' : 'Unavailable'}
              </span>
              
              <span className="text-gray-600">Response time:</span>
              <span>{diagnosticsResult.connectionTest.responseTime}ms</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-3 flex justify-between">
        <button
          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
          onClick={refreshDiagnostics}
        >
          Refresh Diagnostics
        </button>
        
        <button
          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
          onClick={() => auth.runDiagnostics()}
        >
          Run Full Diagnostics
        </button>
      </div>
    </div>
  );
} 