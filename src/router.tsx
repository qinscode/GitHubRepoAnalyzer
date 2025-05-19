import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routes";

// Create QueryClient instance
const queryClient = new QueryClient();

// Create router tree
const router = createRouter({
	routeTree,
	defaultPreload: "intent",
});

// Create router
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Add additional configuration, such as default preloading
router.subscribe("onBeforeLoad", () => {
	// You can add custom logic before route loading
});

// Wrap RouterProvider with QueryClientProvider
export function RouterWithProviders() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}

// Declare router types for global use
export type RouterWithProviders = typeof router;
