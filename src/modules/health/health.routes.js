export default async function routesHealth(server, options) {
  server.get("/", async (req, rep) => {
    return { status: true };
  });
}
