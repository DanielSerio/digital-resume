import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/scoped/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/scoped/"!</div>;
}
