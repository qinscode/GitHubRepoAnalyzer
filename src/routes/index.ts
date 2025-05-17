import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { GitHub } from "../pages/GitHub";

// GitHub analysis page route (set as root path)
export const githubRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: GitHub,
});

// Export all routes
export const routeTree = rootRoute.addChildren([githubRoute]);
