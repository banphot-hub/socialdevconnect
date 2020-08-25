module.exports = {
        swaggerDefinition: {
          info: {
            description:
              "This is the Devconnector API for developer social network.  You can find out more about devconnector at [http://devconnector.io](http://devconnector.io) or on [irc.freenode.net, #devconnector](http://devconnector.io.io/irc/).      For this API, you can use the api key `special-key` to test the authorization     filters.",
            title: "Devconnector API",
            version: "1.0",
            termsOfService: "http://swagger.io/terms/",
            contact: {
              name: "Banphot Khongpom",
              email: "banphot.kho@outlook.com",
              url: "http://www.ooxgen.com",
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
              name: "Deveconnector",
              description: "API for users in the system",
            },
          ],
          schemes: ["http", "https"],
        },
        apis: ["./routes/api/*.js"],
      }