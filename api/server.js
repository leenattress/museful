// relates to file reading
const fs = require("fs-extra");

// git things
const userName = require("git-user-name");
const slugify = require("slugify");
const getRepoInfo = require("git-repo-info");
const git = getRepoInfo();

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

function clog(msg) {
  var currentDate = "[" + new Date().toUTCString() + "]: ";
  console.log("🐔", currentDate, msg);
}
// commitred function to get meta-data
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

async function rightPlace() {
  return (
    fs.existsSync(process.cwd() + "/package.json") &&
    fs.existsSync(process.cwd() + "/musings") &&
    fs.existsSync(process.cwd() + "/musings/museful.json")
  );
}

// _GET to list
async function getMusingsFromTimestamp(timestamp) {
  const path = require("path");
  let musingFolder = `${process.cwd()}/musings/src`;
  musingFolder = path.normalize(musingFolder); //that's that

  var glob = require("glob");
  var options = {};
  const files = await glob.sync(`${musingFolder}/${timestamp}-*.md`, options);
  return files;
}

// _POST to create
async function createMusing(body) {
  const musingFolder = `${process.cwd()}/musings/src/`;
  const timeNow = Date.now();

  const actualCommit = git.abbreviatedcommit
    ? git.abbreviatedcommit
    : "no-commit";
  const markdownContent = `
[meta-date]: <> (${new Date().toISOString()})
[meta-branch]: <> (${git.branch})
[meta-commit]: <> (${git.abbreviatedcommit ? git.abbreviatedcommit : "none"})
[meta-user]: <> (${userName()})

`;

  if (!!userName()) {
    saveFileName =
      musingFolder +
      timeNow +
      "-" +
      slugify(userName() + "-" + git.branch + "-" + actualCommit, {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        lower: true // convert to lower case, defaults to `false`
      }) +
      ".md";
  }
  // return await markdown.file.create(body);
  await fs.writeFile(saveFileName, markdownContent + body.content);
  return timeNow;
}
app.post("/musings", async function(req, res) {
  try {
    if (req.body.content) {
      const id = await createMusing(req.body);
      clog("→ created musing " + id);
      res.json({ status: "ok", id });
    } else {
      throw "content required";
    }
  } catch (error) {
    res.status(500).send({ status: "heck", error });
  }
});

// _PUT to update
async function updateMusing(id, body) {
  //const musingFolder = `${process.cwd()}/musings/src/`;
  const matchingMusings = await getMusingsFromTimestamp(id);

  if (matchingMusings && matchingMusings[0]) {
    saveFileName = matchingMusings[0];
  }

  // return await markdown.file.create(body);
  await fs.writeFile(saveFileName, body.content);
  return timeNow;
}
app.put("/musings", async function(req, res) {
  try {
    if (req.body.content && req.body.id && req.body.id !== '') {
      clog("→ update musing " + req.body.id);
      await updateMusing(req.body.id, req.body);
      res.json({ status: "ok", id });
    } else {
      throw "content and id required";
    }
  } catch (error) {
    res.status(500).send({ status: "heck", error });
  }
});

// _GET to list
async function listMusings(params) {
  const musingFolder = `${process.cwd()}/musings/src`;

  const files = fs
    .readdirSync(musingFolder)
    .filter(
      file =>
        file.indexOf(".") !== 0 &&
        file !== musingFolder &&
        file !== "index.md" &&
        file !== "404.md" &&
        file.slice(-3) === ".md"
    )
    .sort()
    .reverse()
    .map(file => {
      const content = fs.readFileSync(musingFolder + "/" + file, "utf8");
      const user = getMeta(content, "user");
      const branch = getMeta(content, "branch");
      const created = getMeta(content, "date");
      const commit = getMeta(content, "commit");
      const id = file.substring(0, file.indexOf("-"));
      return { id, file, user, created, branch, content, commit };
    });

  return files;
}
app.get("/musings", async function(req, res) {
  if (rightPlace()) {
    const musings = await listMusings(req.query);
    clog("← get " + musings.length + " musings");
    res.json({ status: "ok", files: musings });
  } else {
    res
      .status(500)
      .send({ status: "heck", error: "museful was not run from project root" });
  }
});

async function getSingleMusing(timestamp) {
  const matchingMusings = await getMusingsFromTimestamp(timestamp);
  if (matchingMusings && matchingMusings[0]) {
    const content = fs.readFileSync(matchingMusings[0], "utf8");
    const user = getMeta(content, "user");
    const branch = getMeta(content, "branch");
    const created = getMeta(content, "date");
    const commit = getMeta(content, "commit");
    const id = timestamp;
    return { id, user, created, branch, content, commit };
  } else {
    return null;
  }
}
app.get("/musings/:timestamp", async function(req, res) {
  if (rightPlace()) {
    const musing = await getSingleMusing(req.params.timestamp);
    if (musing) {
      clog("← get musing " + req.params.timestamp);
      res.json({ status: "ok", musing });
    } else {
      res.status(404).send({ status: "heck", error: "not found" });
    }
  } else {
    res
      .status(500)
      .send({ status: "heck", error: "museful was not run from project root" });
  }
});

app.get("/commits", async function(req, res) {
  if (rightPlace()) {
    const gitlog = require("gitlog"); //https://www.npmjs.com/package/gitlog

    const options = {
      repo: process.cwd(),
      number: 20,
      // , author: 'Gabriel Crowe'
      fields: ["hash", "abbrevHash", "subject", "authorName", "authorDateRel"],
      execOptions: { maxBuffer: 1000 * 1024 }
    };

    clog("← commits requested");

    const commits = gitlog(options);
    res.json({ status: "ok", commits });
  } else {
    res
      .status(500)
      .send({ status: "heck", error: "museful was not run from project root" });
  }
});

async function readPackageJson() {
  const packageObject = JSON.parse(
    fs.readFileSync(`${process.cwd()}/package.json`, "utf8")
  );
  return packageObject;
}
app.get("/package", async function(req, res) {
  if (rightPlace()) {
    try {
      clog("← package requested");
      res.json({ status: "ok", package: await readPackageJson() });
    } catch (error) {
      res.status(500).send({ status: "heck", error });
    }
  } else {
    res
      .status(500)
      .send({ status: "heck", error: "museful was not run from project root" });
  }
});

// local debug
app.listen(3000, function() {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
