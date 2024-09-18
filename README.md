# eink-dashboard

Applications to support generating and hosting content for an `e-ink` dashboard.

## usage

This project is largely meant to be _forked_, edited and run. Some of this may
be refactored to be more "librarified". Until then, here's the scoop:

### run

- install [rad](https://github.com/cdaringe/rad/?tab=readme-ov-file#install)
  (e.g.
  `curl -fsSL https://raw.githubusercontent.com/cdaringe/rad/main/assets/install.sh | sh`)
- `rad dockerRun`

### develop

- install `node.js`, matching the version [.nvmrc](./.nvmrc). I recommend using
  [fnm](https://github.com/Schniz/fnm)
- install `pnpm`
- `pnpm install` -`cd apps/{APP_NAME} && pnpm run dev`
