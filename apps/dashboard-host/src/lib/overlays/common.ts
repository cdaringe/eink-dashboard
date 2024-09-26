import { DashboardContext } from "../context";

export type Overlay = (ctx: DashboardContext) => Promise<DashboardContext>;
