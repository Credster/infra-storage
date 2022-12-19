export default async function route(server, options) {
  server.get("/status", async (req, rep) => {
    return { status: true };
  });
}
