import { createRootRoute } from "@tanstack/react-router";
import { RootComponent } from "../components/layout/Root";

// 创建根路由
export const rootRoute = createRootRoute({
  component: RootComponent,
});

export { rootRoute as Route };
