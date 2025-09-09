import { cn } from "@/lib/utils";
import type { AreaHTMLAttributes } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

export interface LayoutProps
  extends Omit<AreaHTMLAttributes<HTMLDivElement>, "id"> {}

function Layout({ children, className, ...props }: LayoutProps) {
  const classNames = cn("relative min-h-screen pt-[72px]", className);

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}

function Header() {
  const routerState = useRouterState();
  const headerClassNames = cn([
    `fixed top-0 left-0 right-0 z-50 flex flex-col`,
    "bg-background",
  ]);
  return (
    <header className={headerClassNames}>
      <div className="bg-muted h-[24px]">TOP</div>
      <nav className="flex border-y flex-row gap-x-2 h-[48px]">
        <Link to="/">Main</Link>
        <Link to="/scoped">Scoped</Link>
        {routerState.resolvedLocation?.pathname === "/scoped" && (
          <select>
            <option>Posting 1</option>
          </select>
        )}
      </nav>
    </header>
  );
}

Header.displayName = "Layout.Header";

Layout.Header = Header;

export { Layout };
