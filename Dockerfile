from node:22-slim as builder-system
workdir /app
env LANG en_US.UTF-8

# sys deps
run apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*


from builder-system as builder

run npm i -g pnpm@8 && pnpm --version
# copy in workspace installation minimum
copy package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# copy in all of the minimum package.json files to ensure that the dependencies are installed
copy apps/dashboard-host/puppeteer.config.cjs ./apps/dashboard-host/
copy apps/dashboard-host/package.json ./apps/dashboard-host/
copy libs/eink-dashboard-common/package.json ./apps/eink-dashboard-common/

# install env flags
env PUPPETEER_CHROME_SKIP_DOWNLOAD true
env PUPPETEER_FIREFOX_SKIP_DOWNLOAD true
env PUPPETEER_CHROME_HEADLESS_SHELL_SKIP_DOWNLOAD true

# install
run pnpm install

# copy in the rest of the files
copy ./ .
run ls -al . && ls -al apps/dashboard-host && cd apps/dashboard-host && npm run build
cmd ["node", "dist/bin/host.js"]
