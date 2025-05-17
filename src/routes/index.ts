import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { Home } from "../pages/Home";
import { GitHub } from "../pages/GitHub";

// 首页路由（移到/home路径）
export const homeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/home",
	component: Home,
});

// GitHub分析页面路由（设为根路径）
export const githubRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: GitHub,
});

// 导出所有路由
export const routes = [homeRoute, githubRoute];
