import fp from 'fastify-plugin';
import Fastify from 'fastify';

export async function server (options = { logger: { level: 'trace' }}) {
    const fastify = Fastify(options);

    fastify.get('/status', async (req, rep) => {
        return { 'status': true}
    })

    return fastify
}