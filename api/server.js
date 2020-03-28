// relates to file reading
const fs = require("fs-extra");

// related to rest api
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

// serve the app folder as root
app.use("/", express.static(path.join(__dirname, "/../frontend/public")));

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Shared function to get meta-data
// a helper function to get meta-data from markdown files
function getMeta(contents, meta) {
    var regStr = `\\[meta-${meta}\\]: <>\\s\\(*(.+)\\)\\s*`;
    var reg = new RegExp(regStr);
    const stringReturn = (contents.match(reg) || []).map(e =>
      e.replace(reg, "$1")
    );
    if (stringReturn[0]) {
      return stringReturn[0];
    } else {
      return null;
    }
  }

// _POST to create
async function createMusing(body) {
  // return await markdown.file.create(body);
  return { all: "gravy" };
}
app.post("/musings", async function(req, res) {
  const newMusing = await createMusing(req.body);
  res.json({ status: "ok", newMusing });
});

// _GET to list
async function listMusings(params) {
  const musingFolder = `${process.cwd()}/musings/src`;

  const files = fs
  .readdirSync(musingFolder)
  .filter(file => 
    (file.indexOf('.') !== 0) && 
    (file !== musingFolder) && 
    (file !== 'index.md') && 
    (file !== '404.md') && 
    (file.slice(-3) === '.md')
    )
  .sort()
  .reverse()
  .map((file) => {
      const content = fs.readFileSync(musingFolder + '/' + file, 'utf8');
      const user = getMeta(content, 'user');
      const branch = getMeta(content, 'branch');
      const created = getMeta(content, 'date');
    return { file, user, created, branch, content };
  });

  return files;
}
app.get("/musings", async function(req, res) {
  const musings = await listMusings(req.query);
  res.json({ status: "ok", files: musings });
});

// local debug
app.listen(3000, function() {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
