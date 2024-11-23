import { Task } from "./common.ts";

export const clean: Task = `pnpm dlx del-cli libs/*/dist apps/*/dist`;
