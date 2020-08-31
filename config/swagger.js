module.exports = {
  swaggerDefinition: {
    info: {
      description:
        "This is the Open-Me API for the Open-API.  You can find out more about open-me at [http://open-me.io](http://ope-me.io) or on [doc.open-me.io, #Open-Me](http://open-me.io/irc/).      For this API, you can use the api key `special-key` to test the authorization     filters.",
      title: "Open-Me API",
      version: "1.0",
      termsOfService: "http://open-me.io/terms/",
      contact: {
        name: "Banphot Khongpom",
        email: "banphot.kho@open-me.io",
        url: "http://www.open-me.io",
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
        name: "Open-Me",
        description: "API Documents-BCP (Business Continuity Plan) application platform ",
      },
    ],
    schemes: ["http", "https"],
  },
  apis: ["./routes/api/*.js"],
};
