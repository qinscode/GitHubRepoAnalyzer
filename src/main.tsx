import React from "react";
import ReactDOM from "react-dom/client";
import { RouterWithProviders } from "./router";
import "./styles/tailwind.css";

const rootElement = document.querySelector("#root") as Element;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<React.Suspense fallback="Loading...">
				<RouterWithProviders />
			</React.Suspense>
		</React.StrictMode>
	);
}
