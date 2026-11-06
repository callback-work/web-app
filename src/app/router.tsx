import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

import { AnalysisPage } from '../pages/analysis/AnalysisPage';
import { AppLayout } from './AppLayout';
import { StartRoute } from './StartRoute';
import type { Services } from './composition';

interface RouterContext {
  services: Services;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const startRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: StartRoute,
});

const analysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analysis/$vacancyId',
  component: AnalysisPage,
});

const routeTree = rootRoute.addChildren([startRoute, analysisRoute]);

export function createAppRouter(services: Services) {
  return createRouter({ routeTree, context: { services } });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
