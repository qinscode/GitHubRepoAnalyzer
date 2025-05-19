import React from "react";
import { isProduction } from "../utils";

export const TanStackTableDevTools = isProduction
	? (): null => null
	: React.lazy(() =>
			import("@tanstack/react-table-devtools").then((result) => ({
				default: result.ReactTableDevtools,
			}))
	  ); 