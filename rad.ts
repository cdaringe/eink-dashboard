import { Task, Tasks } from "./.rad/common.ts";
import { deploy } from "./.rad/deploy.ts";

const hostTags = ["cdaringe/eink-dasbhboard-host", "edh"];

const dockerBuild: Task =
  `docker build --progress=plain --platform linux/amd64 ${
    hostTags.map((it) => `-t ${it}`).join(" ")
  } .`;

const dockerComposeRunBaseCmd =
  `docker-compose up --build --force-recreate --remove-orphans`;
const dockerRun: Task = {
  fn: ({ sh }) => sh(dockerComposeRunBaseCmd),
};

const format: Task = `deno fmt`;

export const tasks: Tasks = {
  install: {
    target: "node_modules",
    prereqs: ["package.json", "pnpm-lock.yaml"],
    onMake: ({ sh }) => sh(`pnpm install`),
  },
  ...{ dockerBuild, db: dockerBuild },
  ...{ dockerRun, dr: dockerRun },
  ...{ format, fmt: format, f: format },
  ...{ deploy },
};
