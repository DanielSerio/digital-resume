import React, { type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

// Simple error fallback component
const DefaultErrorFallback: React.FC<{
  error?: Error;
  resetError?: () => void;
}> = ({ error, resetError }) => (
  <div className="min-h-[200px] flex items-center justify-center border border-red-200 rounded-lg bg-red-50">
    <div className="text-center p-6">
      <h2 className="text-lg font-semibold text-red-800 mb-2">
        Something went wrong
      </h2>
      <p className="text-red-600 mb-4">
        An error occurred while loading this section.
      </p>
      {error && (
        <details className="text-left mb-4">
          <summary className="cursor-pointer text-red-700 hover:text-red-800">
            Show error details
          </summary>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded border overflow-auto max-w-md">
            {error.stack || error.message}
          </pre>
        </details>
      )}
      {resetError && (
        <button
          onClick={resetError}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

// Modern functional error boundary using React 18+ patterns
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
}) => {
  return (
    <>
      <React.Suspense
        fallback={
          <div className="min-h-[100px] flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        }
      >
        <ErrorCatcher fallback={fallback}>{children}</ErrorCatcher>
      </React.Suspense>
    </>
  );
};

// Internal error catching component using error boundaries pattern
const ErrorCatcher: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback,
}) => {
  const [error, setError] = React.useState<Error | null>(null);

  // Reset error state
  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  // Error boundary effect
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setError(new Error(event.reason));
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  // If there's an error, show fallback
  if (error) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <DefaultErrorFallback error={error} resetError={resetError} />;
  }

  // Wrap children in try-catch using ErrorBoundary pattern
  try {
    return <>{children}</>;
  } catch (caughtError) {
    if (caughtError instanceof Error) {
      setError(caughtError);
    } else {
      setError(new Error("An unknown error occurred"));
    }
    return null;
  }
};

// For sections that might fail independently
export const SectionErrorBoundary: React.FC<{
  children: ReactNode;
  sectionName?: string;
}> = ({ children, sectionName = "section" }) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="border border-yellow-200 rounded-lg bg-yellow-50 p-4">
          <div className="text-yellow-800 font-medium">
            Unable to load {sectionName}
          </div>
          <div className="text-yellow-600 text-sm mt-1">
            This section encountered an error and couldn't be displayed.
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
