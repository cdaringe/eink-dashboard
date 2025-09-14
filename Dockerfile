from cdaringe/docker-nodejs-browser-snapshot-base

copy --chown=node:users package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# copy in all of the minimum package.json files to ensure that the dependencies are installed
copy --chown=node:users patches/ ./patches/
copy --chown=node:users apps/dashboard-host/package.json ./apps/dashboard-host/
copy --chown=node:users apps/web-dashboard/package.json ./apps/web-dashboard/
copy --chown=node:users libs/eink-dashboard-common/package.json ./libs/eink-dashboard-common/
run tree

# install
env PUPPETEER_SKIP_CHROME_DOWNLOAD=true
env PUPPETEER_SKIP_CHROME_HEADLESS_SHELL_DOWNLOAD=true
# user root
run --mount=type=cache,id=pnpm,target=/pnpm/store NODE_ENV=development pnpm install --frozen-lockfile
# @warn this version must match that in apps/dashboard-host/package.json!
# run set -x && pnpm dlx puppeteer@23.3.1 install chrome --install-deps

# copy in the rest of the files
copy --chown=node:users ./ .

# build
run pnpm -r --filter ./apps/dashboard-host/ run build \
  && tree apps/dashboard-host/dist

workdir /app/apps/dashboard-host
env NODE_ENV=production
env TZ=America/Los_Angeles
env NODE_PATH="./node_modules;$(npm root -g)"
env PUPPETEER_EXECUTABLE_PATH=/opt/google/chrome/chrome
env NODE_NO_WARNINGS=1
cmd ["node", "dist/bin/host.js"]
