export default async function shutdownPlugin(server, options) {
  process.on("SIGINT", () => server.close());
  process.on("SIGTERM", () => server.close());
}
