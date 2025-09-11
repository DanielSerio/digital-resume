import { cn } from "@/lib/utils";
import type { AreaHTMLAttributes, PropsWithChildren } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export interface LayoutProps
  extends Omit<AreaHTMLAttributes<HTMLDivElement>, "id"> {}

function Layout({ children, className, ...props }: LayoutProps) {
  const classNames = cn("relative min-h-screen pt-[112px]", className);

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}

function Header() {
  const routerState = useRouterState();
  const currentPath = routerState.resolvedLocation?.pathname;

  const headerClassNames = cn([
    `fixed top-0 left-0 right-0 z-50 flex flex-col`,
    "bg-background border-b",
  ]);

  return (
    <header className={headerClassNames}>
      {/* Top bar with title and export buttons */}
      <div className="flex justify-between items-center px-6 py-3 border-b">
        <h1 className="text-lg font-semibold">Digital Resume Manager</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            Export DOC
          </Button>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex items-center px-6 py-3 gap-6">
        <Link
          to="/main"
          className={cn(
            "font-medium transition-colors hover:text-foreground/80",
            currentPath === "/main"
              ? "text-foreground border-b-2 border-primary pb-1"
              : "text-foreground/60"
          )}
        >
          Main Resume
        </Link>
        <Link
          to="/scoped"
          className={cn(
            "font-medium transition-colors hover:text-foreground/80",
            currentPath === "/scoped"
              ? "text-foreground border-b-2 border-primary pb-1"
              : "text-foreground/60"
          )}
        >
          Scoped Resumes
        </Link>
      </nav>
    </header>
  );
}

Header.displayName = "Layout.Header";

Layout.Header = Header;

function Page({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main id="page" className={cn(`p-8`, className)}>
      {children}
    </main>
  );
}

export { Layout, Page };
