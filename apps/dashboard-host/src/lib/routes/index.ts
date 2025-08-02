import { route as route_get_api_dashboard_refresh } from "./GET_api_dashboard_refresh";
import { route as route_get_api_dashboard_version } from "./GET_api_dashboard_version";
import { route as route_get_dashboard } from "./GET_dashboard";
import { route as route_get_dashboard_name } from "./GET_dashboard_name";
import { route as route_get_public } from "./GET_public";
import { route as route_fallback } from "./fallback";
export const routes = [
  route_get_api_dashboard_refresh,
  route_get_api_dashboard_version,
  route_get_dashboard_name, // Must come before route_get_dashboard for proper matching
  route_get_dashboard,
  route_get_public,
  route_fallback,
] as const;
