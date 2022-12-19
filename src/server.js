import fp from "fastify-plugin";
import Fastify from "fastify";

import healthRoutes from "./modules/health/routes/health.routes.js";

export async function server(options = { logger: { level: "trace" } }) {
  const fastify = Fastify(options);

  fastify.register(fp(healthRoutes));

  return fastify;
}
