import { server } from './src/server.js'

const start = async () => {
  const appServer = await server();

  try {
    await appServer.listen({ port: 3001 });
  } catch (err) {
    appServer.log.error(err);
    process.exit(1);
  }
}

start();