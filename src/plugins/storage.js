import { Storage } from "@google-cloud/storage";

export default async function storagePlugin(server, options, done) {
  const serviceAccountKeyBuffer = Buffer.from(
    server.config.GCLOUD_SERVICE_ACCOUNT_JSON,
    "base64"
  );
  const serviceAccountKeyJSON = JSON.parse(
    serviceAccountKeyBuffer.toString("utf-8")
  );

  const storage = new Storage({ credentials: serviceAccountKeyJSON });
  server.decorate("storage", storage);
}
