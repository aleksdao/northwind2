var mongoose = require("mongoose");
//don't hardocde connection string-- use environment variables
mongoose.connect("mongodb://localhost/northwind2");
var Schema = mongoose.Schema;

var db= mongoose.connection;
db.on("error", console.error.bind(console, "mongo db connection error"));

var productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    default: 5
  }
});

var Product = mongoose.model("product", productSchema);

//how about exporting a method that will allow you to connect to the database...
module.exports = {
  Product: Product
};
