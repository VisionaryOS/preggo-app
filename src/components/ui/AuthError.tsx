import { XCircle, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { runSupabaseDiagnostics, getDiagnosticSummary } from '@/lib/supabase/diagnostics';
import { useAuthStore } from '@/hooks/useAuth';

interface AuthErrorProps {
  message: string;
  severity: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  onDismiss?: () => void;
  showCircuitBreaker?: boolean;
}

export function AuthError({ 
  message, 
  severity, 
  onRetry, 
  onDismiss,
  showCircuitBreaker = true
}: AuthErrorProps) {
  const [diagnosticInfo, setDiagnosticInfo] = useState<string | null>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const auth = useAuthStore();
  const circuitBreakerStatus = auth.circuitBreakerStatus;

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    try {
      const results = await runSupabaseDiagnostics();
      const { issues, recommendations } = getDiagnosticSummary(results);
      
      if (issues.length > 0) {
        setDiagnosticInfo(`Issues found: ${issues.join(', ')}. ${recommendations.join('. ')}`);
      } else {
        setDiagnosticInfo('No issues detected. The problem might be temporary.');
      }
    } catch (err) {
      setDiagnosticInfo('Unable to run diagnostics. Please try again later.');
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  useEffect(() => {
    setDiagnosticInfo(null);
  }, [message]);

  const bgColor = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  }[severity];

  const textColor = {
    error: 'text-red-800',
    warning: 'text-amber-800',
    info: 'text-blue-800',
  }[severity];

  const Icon = {
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  }[severity];

  return (
    <div className={`rounded-lg border p-4 ${bgColor} mb-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${textColor}`} />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${textColor}`}>
            {severity === 'error' ? 'Authentication Error' : 
             severity === 'warning' ? 'Authentication Warning' : 
             'Authentication Info'}
          </h3>
          <div className={`mt-2 text-sm ${textColor}`}>
            <p>{message}</p>
            
            {/* Circuit breaker status */}
            {showCircuitBreaker && circuitBreakerStatus.isOpen && (
              <div className="mt-2 text-sm p-2 border border-red-200 rounded bg-red-50">
                <p className="font-medium">Authentication circuit breaker is open</p>
                <p>Authentication operations are temporarily disabled to prevent performance issues.</p>
                <p>Failures: {circuitBreakerStatus.failures}</p>
                <button
                  type="button"
                  onClick={() => auth.resetCircuitBreaker()}
                  className="mt-2 inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Reset Circuit Breaker
                </button>
              </div>
            )}
            
            {diagnosticInfo && (
              <p className="mt-2 text-sm">
                <strong>Diagnostic Results:</strong> {diagnosticInfo}
              </p>
            )}
            
            <div className="mt-3 flex flex-wrap gap-3">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  disabled={circuitBreakerStatus.isOpen && !circuitBreakerStatus.canRetry}
                  className={`rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm 
                    ${severity === 'error' ? 'text-red-600 hover:bg-red-50' : 
                     severity === 'warning' ? 'text-amber-600 hover:bg-amber-50' :
                     'text-blue-600 hover:bg-blue-50'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Try Again
                </button>
              )}
              
              {!diagnosticInfo && (
                <button
                  type="button"
                  onClick={runDiagnostics}
                  disabled={isRunningDiagnostics}
                  className={`rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm 
                    ${severity === 'error' ? 'text-red-600 hover:bg-red-50' : 
                     severity === 'warning' ? 'text-amber-600 hover:bg-amber-50' :
                     'text-blue-600 hover:bg-blue-50'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isRunningDiagnostics ? 'Running Diagnostics...' : 'Run Diagnostics'}
                </button>
              )}
              
              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 