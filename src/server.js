import { dirname, join } from "path";
import { fileURLToPath } from "url";

import autoload from "@fastify/autoload";
import Fastify from "fastify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function server(options = { logger: { level: "trace" } }) {
  const fastify = Fastify(options);

  fastify.register(autoload, {
    dir: join(__dirname, "modules"),
    dirNameRoutePrefix: true,
    indexPattern: /.*\.routes(\.ts|\.js|\.cjs|\.mjs)$/,
  });

  fastify.register(autoload, {
    dir: join(__dirname, "plugins"),
    encapsulate: false,
    ignorePattern: /.*(test|spec).js/,
  });

  return fastify;
}
