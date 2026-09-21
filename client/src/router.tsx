import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import HomePage from "./routes/index";
import ChatPage from "./routes/chat";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: ChatPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  chatRoute,
]);

export const router = createRouter({
  routeTree,
});