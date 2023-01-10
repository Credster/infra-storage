import fastifyEnv from "@fastify/env";

export default async function configPlugin(server, options, done) {
  const schema = {
    type: "object",
    required: [
      "HTTP_PORT",
      "HTTP_HOST",
      "GCLOUD_SERVICE_ACCOUNT_JSON",
      "GCLOUD_STORAGE_UPLOADS_BUCKET",
      "GCLOUD_STORAGE_UPLOADS_PRESIGNED_TOKEN_EXPIRATION_MIN",
    ],
    properties: {
      HTTP_PORT: {
        type: "number",
        default: 3001,
      },
      HTTP_HOST: {
        type: "string",
        default: "0.0.0.0",
      },
      GCLOUD_SERVICE_ACCOUNT_JSON: {
        type: "string",
        default: "{}",
      },
      GCLOUD_STORAGE_UPLOADS_BUCKET: {
        type: "string",
      },
      GCLOUD_STORAGE_UPLOADS_PRESIGNED_TOKEN_EXPIRATION_MIN: {
        type: "number",
        default: 30,
      },
    },
  };

  const configOptions = {
    // decorate the Fastify server instance with `config` key
    // such as `fastify.config('HTTP_PORT')
    confKey: "config",
    // schema to validate
    schema: schema,
    // source for the configuration data
    data: process.env,
    // will read .env in root folder
    dotenv: true,
    // will remove the additional properties
    // from the data object which creates an
    // explicit schema
    removeAdditional: true,
  };

  return fastifyEnv(server, configOptions, done);
}
