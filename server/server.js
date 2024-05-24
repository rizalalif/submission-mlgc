require("dotenv").config();

const Hapi = require("@hapi/hapi");
const loadModel = require("../services/loadModel");
const routes = require("./routes");
const InputError = require("../exceptions/InputError.js");


(async () => {
  const server = Hapi.server({
    port: process.env.port || 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;
  server.route(routes);

  server.ext("onPreResponse", function (request, h) {
    const response = request.response;

    if (response instanceof InputError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.isBoom) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
        // code: response.statusCode,
      });
      newResponse.code(413);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Listening on ${server.info.uri}`);
})();
