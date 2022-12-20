import fastifyEnv from "@fastify/env";

export default async function configPlugin(server, options, done) {
  const schema = {
    type: "object",
    required: ["PORT"],
    properties: {
      PORT: {
        type: "string",
        default: 3001,
      },
      GCLOUD_SERVICE_ACCOUNT_JSON: {
        type: "string",
        default: "{}",
      },
    },
  };

  const configOptions = {
    // decorate the Fastify server instance with `config` key
    // such as `fastify.config('PORT')
    confKey: "config",
    // schema to validate
    schema: schema,
    // source for the configuration data
    data: process.env,
    // will read .env in root folder
    dotenv: true,
  };

  return fastifyEnv(server, configOptions, done);
}
