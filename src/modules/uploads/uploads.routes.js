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
  server.get("/form", async (request, reply) => {
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
