const server = require('fastify')();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 4000;

console.log('worker pid=', process.pid);

server.get('/recipes/:id', async (reqest, reply) => {
    console.log('worker request pid=', process.pid);
    const id = Number(reqest.params.id);
    if (id != 42) {
        reply.statusCode = 404;
        return { error: 'not_found' };
    }
    return {
        producer_pid: process.pid,
        recipe: {
            id,  name: 'Chicken Tikka Masala',
            steps: 'Throw it in the pot...',
            ingredients: [
                { id: 1, name: 'chicken', quantity: '1 lb' },
                { id: 2, name: 'Sauce', quantity: '2 cups' },
            ]
        }
    };
});

server.listen({ port: PORT, host: HOST }, (err, address) => {
    if (err) {
        console.error(err);
        server.log.error(err);
        process.exit(1);
    }
    console.log(`Producer running at http://${HOST}:${PORT}`);
});