import { Storage } from "@google-cloud/storage";

export default async function storagePlugin(server, options, done) {
  const serviceAccountKeyJSON = JSON.parse(
    server.config.GCLOUD_SERVICE_ACCOUNT_JSON
  );

  const storage = new Storage({ credentials: serviceAccountKeyJSON });
  server.decorate("storage", storage);
}
