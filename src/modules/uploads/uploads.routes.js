export default async function routesUpload(server, options) {
  // @TODO add rate-limit per user
  server.post("/formdata_token", async (request, reply) => {
    const bucketName = server.config.GCLOUD_STORAGE_UPLOADS_BUCKET;
    // @TODO use a fixed identifier for the user such as a
    // uuid+hash(useremail)+nameOfFileTarget, i.e:
    // 17172181791212-dvb8b8bv83b+certImage.jpg
    const fileName = "upload-file.jpg";

    const storageBucket = server.storage.bucket(bucketName);
    const storageFile = storageBucket.file(fileName);

    const tokenExpirationTime =
      Date.now() +
      server.config.GCLOUD_STORAGE_UPLOADS_PRESIGNED_TOKEN_EXPIRATION_MIN *
        60 *
        1000;
    const tokenOptions = {
      expires: tokenExpirationTime,
    };

    const [response] = await storageFile.generateSignedPostPolicyV4(
      tokenOptions
    );
    reply.code(200).send(response);
  });

  server.post("/url_token", async (request, reply) => {
    reply.code(200).send();
  });
}
