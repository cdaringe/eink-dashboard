import * as sdk from "..";
import http from "node:http";

export const route = {
  method: "*",
  path: "*",
  handler:
    (state: sdk.state.State): http.RequestListener => async (_req, res) => {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      const document = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 Not Found</title>
      </head>
      <body>
        <h1>404 Not Found</h1>
        <p>The requested URL was not found on this server.</p>
        <p>Available routes:</p>
        <ul>
          ${
        state.routes
          .map(
            (route) => {
              if ("pathnameDisplay" in route) {
                return `<li><code>${route.method} ${route.pathnameDisplay}</code></li>`;
              } else {
                return `<li><code>${route.method} ${
                  route.method.match(/get/i)
                    ? `<a href=${route.path}>${route.path}</a>`
                    : route.path
                }</code></li>`;
              }
            },
          )
          .join("")
      }
        </ul>
      </body>
      </html>
      `;
      res.end(document);
    },
};
