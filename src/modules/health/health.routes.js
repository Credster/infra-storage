export default async function routesHealth(server, options) {
  server.get("/", async (request, reply) => {
    return { status: true };
  });
}
