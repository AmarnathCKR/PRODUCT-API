const mongoose = require("mongoose");
require('dotenv').config()

const URI = process.env.MONGODB_SECRET_URL;
const db = mongoose.connection;

const config = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(URI, config);

db.on("open", () => {
  console.log(`You are connected to MongoDB`);
})
  .on("error", (err) => {
    console.log(err);
  })
  .on("close", () => {
    console.log(`You are no longer connected to Mongo`);
  });

module.exports = mongoose
