import React from "react";
import { isProduction } from "../utils";

export const ReactHookFormDevTools = isProduction
	? (): null => null
	: React.lazy(() =>
			import("@hookform/devtools").then((result) => ({
				default: result.DevTool,
			}))
	  ); 