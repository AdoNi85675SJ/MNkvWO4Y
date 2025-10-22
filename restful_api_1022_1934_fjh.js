// 代码生成时间: 2025-10-22 19:34:53
const Hapi = require('@hapi/hapi');
const Joi = require('joi');

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 3000,
});

// Define the schema for the POST request
const userSchema = Joi.object({
  id: Joi.number().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
});

// Define the routes
const routes = [
  {
    method: 'GET',
    path: '/users',
    handler: async (request, h) => {
      const users = []; // Assuming a database fetch operation
      return users;
    },
  },
  {
    method: 'POST',
    path: '/users',
    options: {
      validate: {
        payload: userSchema,
      },
    },
    handler: async (request, h) => {
      const { id, username, email } = request.payload;
      // Simulate a database operation
      const newUser = { id, username, email }; // In a real scenario, you would save this to a database
      return newUser;
    },
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: async (request, h) => {
      const { id } = request.params;
      const user = { id, username: 'John Doe', email: 'john.doe@example.com' }; // Assuming a database fetch operation
      return user;
    },
  },
];

// Start the server and add the routes
async function start() {
  try {
    await server.register(Hapi.plugins.vision);
    await server.views({
      engines: { html: require('handlebars') },
      relativeTo: __dirname,
      path: 'views',
    });
    await server.start();
    console.log('Server running on %s', server.info.uri);
    await server.route(routes);
  } catch (err) {
    console.error('Server failed to start: ', err);
    process.exit(1);
  }
}

// Export the start function so it can be tested
module.exports = { start };

// If this module is the entry point, run the server
if (require.main === module) {
  start();
}
