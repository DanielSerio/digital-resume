import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";

import { Layout, ErrorBoundary } from "@/components/common";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Layout.Header />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
      <Toaster />
    </Layout>
  ),
  pendingComponent: () => (
    <Layout>
      <Layout.Header />
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    </Layout>
  ),
  errorComponent: ({ error }) => (
    <Layout>
      <Layout.Header />
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Something went wrong
          </h2>
          <p className="text-muted-foreground mb-4">
            An error occurred while loading the application.
          </p>
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Show error details
            </summary>
            <pre className="mt-2 text-xs bg-red-50 p-2 rounded border overflow-auto max-w-full">
              {error?.message || "Unknown error"}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </Layout>
  ),
});
