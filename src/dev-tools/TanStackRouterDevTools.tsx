import React from "react";
import { isProduction } from "../utils";

export const TanStackRouterDevTools = isProduction
	? (): null => null
	: React.lazy(() =>
			import("@tanstack/router-devtools").then((result) => ({
				default: result.TanStackRouterDevtools,
			}))
	  ); 