import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rootRoute } from "./routes/__root";
import { routes } from "./routes";

// 创建 QueryClient 实例
const queryClient = new QueryClient();

// 创建路由树
const routeTree = rootRoute.addChildren(routes);

// 创建路由器
export const router = createRouter({ 
  routeTree,
  context: {
    queryClient,
  },
  // 可以添加其他配置，如默认预加载等
  // defaultPreload: 'intent',
});

// 包装 RouterProvider，添加 QueryClientProvider
export const RouterWithProviders: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

// 声明路由类型，供全局使用
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
} 