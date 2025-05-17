import { createRootRoute } from "@tanstack/react-router";
import Root from "../components/layout/Root";

// Create root route
export const rootRoute = createRootRoute({
  component: Root,
});

export { rootRoute as Route };
