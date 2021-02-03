// @=================================================================================================================================
// @Create by       Banphot Khongpom
// @Desc            API for developer social network
// @access          Private
// @Create date     25/08/2020
// @=================================================================================================================================

// Load package for Middleware porject
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
//Load Configuration file
const config = require("./config/config");

// Load api route
const User = require("./routes/api/user");
const Post = require("./routes/api/post");
const Profile = require("./routes/api/profile");
const Authen = require("./routes/api/authen");
const ProductCategory = require("./routes/api/productcategory");
const Productunit = require("./routes/api/prouductunit");
const customers = require("./routes/api/customers");
const Supplier = require("./routes/api/supplier");
const Product = require("./routes/api/product");

//Load swagger document and package
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOption = require("./config/swagger");

// Create express app
let app = express();

// Load database connection from configuration
let db = require("./config/config").mongoURI;

//Connect mongodb database
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Database has connection successfully"))
  .catch((err) => console.log(err));

// Load swagger
const swaggerDocs = swaggerJsDoc(swaggerOption);
// Create route for API Documents.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// load
app.use(fileupload());
app.server = http.createServer(app);

// middleware
// pare bodyparser json application
app.use(
  bodyParser.json({
    limit: config.bodyLimit,
  })
);
app.use(express.json({ extended: false }));

// set header
app.use(function (req, res, next) {
  res.header("X-powered-by", "dev-express");
  next();
});

// Settting Middleware for api route

app.use("/api/v1/users", User);
app.use("/api/v1/post", Post);
app.use("/api/v1/profile", Profile);
app.use("/api/v1/authen", Authen);
app.use("/api/v1/productcategory", ProductCategory);
app.use("/api/v1/productunit", Productunit);
app.use("/api/v1/customers", customers);
app.use("/api/v1/supplier", Supplier);
app.use("/api/v1/product", Product);

// Start service app server
app.server.listen(config.port);
console.log(`Started on port ${app.server.address().port}`);
