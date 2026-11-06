import { useRouteContext } from '@tanstack/react-router';

import { StartPage } from '../pages/start/StartPage';

export function StartRoute() {
  const { services } = useRouteContext({ from: '/' });
  return <StartPage {...services} />;
}
