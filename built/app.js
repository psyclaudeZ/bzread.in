var express = require("express");
var app = express();
var fs = require("fs");
var port = process.env.PORT || 3000;
app.get("/", function (req, res) {
    try {
        var html = fs.readFileSync("src/client/index.html");
        res.writeHead(200);
        res.write(html);
        res.end();
    }
    catch (err) {
        res.send("Oopsie: " + err);
    }
});
app.get("/test", function (req, res) {
    res.send("Hitting the test route.");
});
app.listen(port, function () {
    console.log("Server started on port ".concat(port));
});
