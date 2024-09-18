# dashboard-host

`dashboard-host`:

- serves display-ready images
- generates new images on a user-specified period

## usage

- `pnpm build && node ./dist/bin/host.js`

## config

Please see [the docker-compose.yml](../../docker-compose.yml).

## architecture

1. The host process--in idle state--is a very thin server that _only_ serves
   images over http
2. On interval, the host invokes a child process to capture new snapshots. The
   snapshot process has few major components:
   1. A webapp. The webapp is _prebuilt_ and served by the snapshot script. The
      webapp is developed in [../web-dashboard](../web-dashboard/), but at
      runtime, the static assets from that project are hosted and accessed
      _entirely_ by the snapshot script. This keeps runtime resources to a
      minimal, and ephemeral only to the snap duration.
   2. Browser screenshots. An embedded chrome instance via puppeteer is used to
      capture an image from the aforementioned webapp.
   3. `convert/magick` is used to process the images into eink ready grayscale.
