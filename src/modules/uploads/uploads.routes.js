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

  // @TODO move all of this token handling
  // out to a service to not duplicate code
  // ---
  // @TODO this shouldn't be exposed publicly
  // and definitely not without a ratelimit
  // in place to avoid spamming the cloud storage
  // service APIs
  /**
   * This is based on Google Cloud Storage APIs
   * and supporting documentation references here:
   * 1. https://cloud.google.com/storage/docs/xml-api/post-object-forms#node.js
   * 2. https://github.com/googleapis/nodejs-storage/blob/434cca4e12fca53e7db7ef3f5865aece94ae937c/samples/generateV4SignedPolicy.js
   * 3.
   */
  server.get("/form", async (request, reply) => {
    const bucketName = server.config.GCLOUD_STORAGE_UPLOADS_BUCKET;
    // @TODO use a fixed identifier for the user such as a
    // uuid+hash(useremail)+nameOfFileTarget, i.e:
    // 17172181791212-dvb8b8bv83b+certImage.jpg
    // @TODO the file extension here should come from the file type
    // as part of the request
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
    // ---

    // Construct an HTML form with the provided policy
    let output = `<form action="${response.url}" method="POST" enctype="multipart/form-data">\n`;
    // Include all fields returned in the HTML form as they're required
    for (const name of Object.keys(response.fields)) {
      const value = response.fields[name];
      output += `  <input name="${name}" value="${value}" type="hidden"/>\n`;
    }
    output += '  <input type="file" name="file"/><br />\n';
    output += '  <input type="submit" value="Upload File"/><br />\n';
    output += "</form>";

    reply.type("text/html");
    reply.send(output);
  });

  /**
   * This is based on PUT Object's presigned URL
   * on Google Cloud Storage as documented here with the
   * following supporting resources:
   * 1. https://cloud.google.com/storage/docs/xml-api/put-object-upload
   * 2. https://cloud.google.com/storage/docs/samples/storage-generate-signed-url-v4
   * 3. https://cloud.google.com/storage/docs/samples/storage-generate-upload-signed-url-v4
   * 4. https://cloud.google.com/blog/products/storage-data-transfer/uploading-images-directly-to-cloud-storage-by-using-signed-url
   *
   */
  server.post("/url_token", async (request, reply) => {
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

    // The following generated URL can be used to send PUT HTTP
    // requests to upload files to, such as:
    //
    // "curl -X PUT -H 'Content-Type: application/octet-stream' " +
    //  `--upload-file my-file '${uploadURLToken}'`
    //
    const [uploadURLToken] = storageFile.getSignedUrl(tokenOptions);

    reply.code(200).send({ uploadURLToken });
  });
}
