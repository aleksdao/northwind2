var express = require('express');
var app = express();
var path = require("path");
var swig = require("swig");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var db = require("./models/db");
var Product = db.Product;

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "html");
app.engine("html", swig.renderFile);

swig.setDefaults({ cache: false });
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(bodyParser.json());


app.get("/", function(req, res, next) {
  res.sendFile(path.join(__dirname, "/views/index.html"));
})

app.get("/products", function(req, res, next) {
  Product.find().sort({priority: 1})
    .then(function(products) {
      res.send(products)
    })
})

app.post("/", function(req, res, next) {
  var name = req.body.name;
  if(req.body.priority)
    priority = req.body.priority;
  else priority = 5;
  Product.create({
    name: name,
    priority: priority
  })
    .then(function() {
      return Product.find().sort({priority: 1});
    })
    .then(function(products) {
      res.send(products);
    })
})

app.delete("/:id", function(req, res, next) {
  Product.findByIdAndRemove(req.params.id)
    .then(function(product) {
      return Product.find().sort({priority: 1});
    })
    .then(function(products) {
      res.send(products);
    })
})

app.put("/:id", function(req, res, next) {
  Product.findById(req.params.id)
    .then(function(product) {
      product.priority = req.body.priority;
      return product.save();
    })
    .then(function(product) {
      res.send(product);
    })
})

app.use(function (err, req, res, next) {
    console.error(err, typeof next);
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});

app.listen(process.env.PORT || 1337, function(req, res, next) {
  console.log("server is running");
})