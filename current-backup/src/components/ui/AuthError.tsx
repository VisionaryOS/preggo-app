import { XCircle, AlertTriangle, Info } from "lucide-react";
import { useEffect, useState } from "react";
import {
  checkSupabaseHealth,
  validateSupabaseConfig,
} from "@/lib/supabase/diagnostics";

interface AuthErrorProps {
  message: string;
  severity: "error" | "warning" | "info";
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function AuthError({
  message,
  severity,
  onRetry,
  onDismiss,
}: AuthErrorProps) {
  const [diagnosticInfo, setDiagnosticInfo] = useState<string | null>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    try {
      const configStatus = validateSupabaseConfig();
      const connectionTest = await checkSupabaseHealth();

      const issues: string[] = [];
      const recommendations: string[] = [];

      if (!configStatus.valid) {
        issues.push("Configuration issues");
        recommendations.push("Check your Supabase environment variables");
      }

      if (!connectionTest.success) {
        issues.push("Connection failed");
        recommendations.push(
          "Check your network connection or Supabase service status",
        );
      }

      if (issues.length > 0) {
        setDiagnosticInfo(
          `Issues found: ${issues.join(", ")}. ${recommendations.join(". ")}`,
        );
      } else {
        setDiagnosticInfo(
          "No issues detected. The problem might be temporary.",
        );
      }
    } catch (err) {
      console.error("Diagnostics error:", err);
      setDiagnosticInfo("Unable to run diagnostics. Please try again later.");
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  useEffect(() => {
    setDiagnosticInfo(null);
  }, [message]);

  const bgColor = {
    error: "bg-red-50 border-red-200",
    warning: "bg-amber-50 border-amber-200",
    info: "bg-blue-50 border-blue-200",
  }[severity];

  const textColor = {
    error: "text-red-800",
    warning: "text-amber-800",
    info: "text-blue-800",
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
            {severity === "error"
              ? "Authentication Error"
              : severity === "warning"
                ? "Authentication Warning"
                : "Authentication Info"}
          </h3>
          <div className={`mt-2 text-sm ${textColor}`}>
            <p>{message}</p>

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
                  className={`rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm 
                    ${
                      severity === "error"
                        ? "text-red-600 hover:bg-red-50"
                        : severity === "warning"
                          ? "text-amber-600 hover:bg-amber-50"
                          : "text-blue-600 hover:bg-blue-50"
                    }`}
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
                    ${
                      severity === "error"
                        ? "text-red-600 hover:bg-red-50"
                        : severity === "warning"
                          ? "text-amber-600 hover:bg-amber-50"
                          : "text-blue-600 hover:bg-blue-50"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isRunningDiagnostics
                    ? "Running Diagnostics..."
                    : "Run Diagnostics"}
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
