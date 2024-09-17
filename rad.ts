import type { Task, Tasks } from "https://deno.land/x/rad/src/mod.ts";

const hostTags = ['cdaringe/eink-dasbhboard-host', 'edh'];
const dockerBuild: Task = `docker build --platform linux/amd64 ${hostTags.map(it => `-t ${it}`).join(' ')} .`;
const dockerRun: Task = {
  dependsOn: [dockerBuild],
  fn({ sh }) {
    return sh(`docker run --platform linux/amd64 -p 8080:8080 ${hostTags[0]}`);
  },
}
export const tasks: Tasks = {
  install: {
    target: "node_modules",
    prereqs: ["package.json", 'pnpm-lock.yaml'],
    onMake: ({ sh }) => sh(`pnpm install`),
  },
  ...{ dockerBuild, db: dockerBuild },
  ...{ dockerRun, dr: dockerRun },
  format: `deno fmt`,
};
