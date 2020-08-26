module.exports = {
  swaggerDefinition: {
    info: {
      description:
        "This is the Dev-Express API for developer social network.  You can find out more about Dev-Express at [http://dev-express.io](http://dev-express.io) or on [irc.freenode.net, #Dev-Express](http://Dev-Express.io.io/irc/).      For this API, you can use the api key `special-key` to test the authorization     filters.",
      title: "Dev-Express API",
      version: "1.0",
      termsOfService: "http://dev-express.io/terms/",
      contact: {
        name: "Banphot Khongpom",
        email: "banphot.kho@outlook.com",
        url: "http://www.dev-express.io",
      },
      servers: ["http://localhost:5000"],
      securityDefinitions: {
        Bearer: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
    },
    host: "localhost:5000",

    tags: [
      {
        name: "Dev-Express",
        description: "API Documents",
      },
    ],
    schemes: ["http", "https"],
  },
  apis: ["./routes/api/*.js"],
};
