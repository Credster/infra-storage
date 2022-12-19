export default async function route(server, options) {
  server.get("/", async (req, rep) => {
    return { status: true };
  });
}
