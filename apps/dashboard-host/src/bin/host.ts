import http  from 'http';
import fs  from 'fs/promises';
import child_process  from 'child_process';
import { dashkinds }  from '@eink-dashboard/common';

const { NODE_ENV, PORT = "8000" } = process.env;

const port = Number(PORT);

const isProd = NODE_ENV?.match(/prod/i);

const DURATION_HR = 1000 * 60 * 60;



const randIndex = (n: number) => Math.floor(Math.random() * n);

const server = http.createServer(async (req, res) => {
  const pathnameParts = req.url!
    .split("/")
    .map((it) => it.toLowerCase().trim())
    .filter(Boolean);
  const [p1, p2] = pathnameParts;
  switch (p1) {
    case "dashboard": {
      const kind =
        p2 && dashkinds.some((kind) => kind === p2)
          ? p2
          : dashkinds[randIndex(dashkinds.length)]!;
      const relativeFilename = `./public/${kind}.png`;
      const fileSize = (await fs.stat(relativeFilename)).size;
      const file = await fs.open(relativeFilename, 'r');
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Length", fileSize.toString());
      return file.createReadStream().pipe(res, {end: true});
    }
    default: {
      const isHtml = req.headers.accept?.match(/html/i);
      res.setHeader("content-type", isHtml ? "text/html" : 'application/json');
      res.statusCode = 404;
      if (isHtml) {
        res.end(
          `<html>
          <body>
            <h1>Not found</h1>
            <p>Did you mean to access /dashboards/{${dashkinds.join("|")}}
          </body>
        </html>`
        );
      }
      return res.end('{ "status": "not found" }');
    }
  }
});

async function runSnapWorkflow() {
  try {
    child_process.execSync("npm run snapshot", {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...(isProd ? { ORIGIN: `http://localhost:${port}` } : {}),
      }
    });
  } catch (error) {
    console.error(`failed: ${error}`);
  } finally {
    setTimeout(runSnapWorkflow, DURATION_HR);
  }
}

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

runSnapWorkflow();
