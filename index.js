// importing express framework
const express = require("express");
const app = express();
// Respond with "hello world" for requests that hit our root "/"
app.get("/", function (req, res) {
 return res.send("Hello Mauboa");
});
// listen to port 3000 by default
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
module.exports = app;