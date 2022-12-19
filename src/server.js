import fp from "fastify-plugin";
import Fastify from "fastify";

import healthRoutes from "./modules/health/routes/health.routes.js";
import shutdownPlugin from "./plugins/shutdown.js";

export async function server(options = { logger: { level: "trace" } }) {
  const fastify = Fastify(options);

  fastify.register(fp(shutdownPlugin));
  fastify.register(fp(healthRoutes));

  return fastify;
}
