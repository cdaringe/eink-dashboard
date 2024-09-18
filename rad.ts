import { Task, Tasks } from "./.rad/common.ts";
import { deploy } from "./.rad/deploy.ts";

const hostTags = ["cdaringe/eink-dasbhboard-host", "edh"];

const dockerBuild: Task =
  `docker build --progress=plain --platform linux/amd64 ${
    hostTags.map((it) => `-t ${it}`).join(" ")
  } .`;

const dockerComposeRunBaseCmd = `docker-compose up --build --force-recreate --remove-orphans`
const dockerRun: Task = {
  fn: ({ sh }) => sh(dockerComposeRunBaseCmd)
};

const format: Task = `deno fmt`;

const deployCopy: Task = `scp -r . $NAS_IP:/volume1/docker/eink-dashboard`;

// const deploy: Task = {
//   dependsOn: [deployCopy],
//   fn({ sh }) {
//     return sh(`ssh $NAS_IP "cd /volume1/docker && docker-compose down -f && ${dockerComposeRunBaseCmd} -d"`);
//   },
// };

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
