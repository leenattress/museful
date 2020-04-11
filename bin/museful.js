// filesystem stuff
const fs = require("fs-extra");
const dirTree = require("directory-tree");

// handling markdown
const MarkdownIt = require("markdown-it"),
  md = new MarkdownIt();
const attrs = require("markdown-it-attrs");
md.use(attrs);

//for deployment
var s3 = require("s3");
var AWS = require("aws-sdk");

// html template building
const nunjucks = require("nunjucks");
const dateFilter = require("nunjucks-date-filter");
dateFilter.setDefaultFormat("dddd, MMMM Do YYYY, h:mm:ss a");
let env = nunjucks.configure({ autoescape: true });
env.addFilter("date", dateFilter);

const { Table } = require("console-table-printer");
const p = new Table({
  columns: [
    { name: 'Filename', alignment: 'left', color: 'yellow' }, //with alignment and color
    { name: 'Written', alignment: 'left', color: 'green' },
  ],
});

// a helper function to get meta-data from markdown files
function getMeta(contents, meta) {
  var regStr = `\\[meta-${meta}\\]: <>\\s\\(*(.+)\\)\\s*`;
  var reg = new RegExp(regStr);
  const stringReturn = (contents.match(reg) || []).map((e) =>
    e.replace(reg, "$1")
  );
  if (stringReturn[0]) {
    return stringReturn[0];
  } else {
    return null;
  }
}

var truncate = function (fullStr, strLen, separator) {
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || "...";

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
};

function render(node, inFolder, outFolder, siteConfig) {

  var begin=Date.now();

  // get the contents of the template file
  var template = fs.readFileSync(
    "musings/themes/" + siteConfig.theme + "/template.html",
    "utf8"
  );

  // this array will be the pages we write
  let pages = [];

  node.forEach((page) => {
    if (page.name != "index.md" && page.name != "404.md") {
      // special cases

      if (page.path && page.type === "file" && page.extension === ".md") {
        // get contents of markdown from disk
        var contents = fs.readFileSync(page.path, "utf8");

        //get the meta info from this file
        let metaDate = getMeta(contents, "date");
        let metaUser = getMeta(contents, "user");
        // let metaTitle = getMeta(contents, "title");
        let metaFeaturedImage = getMeta(contents, "featured");

        // we need a date, a title and an author for a page to be returned
        if (contents && metaDate) {
          // render the markdown to html
          var htmlResult = md.render(contents);

          // replace md in the filename for html
          filename = page.name.substr(0, page.name.lastIndexOf(".")) + ".html";

          // add to the page array
          pages.push({
            pageTitle: "CHANGE ME",
            pageDate: metaDate,
            pageContent: htmlResult,
            pageLink: filename,
            pageFeaturedImage: metaFeaturedImage,
            filename: filename,
            user: metaUser,
            siteConfig: siteConfig, // every page gets a copy of the config
          });
        }
      }
    }
  });

  //sort the pages by created date
  pages.sort(function (a, b) {
    // Turn strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.pageDate) - new Date(a.pageDate);
  });

  pages.forEach((page) => {
    // attach the pages to each page, as a history
    page.history = pages;
  });

  // we need a series of index pages, if we have lots of articles
  const articlesPerPage = siteConfig.articlesPerPage;
  const indexPageCount = Math.ceil(pages.length / articlesPerPage);
  // console.log("Index pages count:", indexPageCount);

  //get index page meta
  // get contents of markdown from disk
  var indexContents = fs.readFileSync(inFolder + "/index.md", "utf8");
  //get the meta info from this file
  let indexMetaTitle = getMeta(indexContents, "title");
  let indexMetaFeaturedImage = getMeta(indexContents, "featured");

  for (let step = 0; step < indexPageCount; step++) {
    const indexPageSlice = pages.slice(
      articlesPerPage * step,
      articlesPerPage * step + articlesPerPage
    );

    let indexFilename = "index.html";
    let linkPrev = null;
    let linkNext = indexPageCount > 1 ? "index2.html" : null;
    if (step > 0) {
      //write secondary index
      indexFilename = "index" + (step + 1) + ".html";

      if (step === indexPageCount - 1) {
        // last index, no next link
        linkPrev = step === 1 ? "index.html" : "index" + step + ".html";
        linkNext = null;
      } else {
        // index in the middle somewhere
        linkPrev = step === 1 ? "index.html" : "index" + step + ".html";
        linkNext = "index" + (step + 2) + ".html";
      }
    }

    // attach all items to history for in page rendering.
    indexPage = {
      pageTitle: indexMetaTitle,
      pageDate: new Date().toISOString(),
      pageContent: md.render(indexContents),
      pageLink: indexFilename,
      pageFeaturedImage: indexMetaFeaturedImage,
      filename: indexFilename,
      siteConfig: siteConfig,
      history: pages,
      indexArticles: indexPageSlice,
      linkPrev: linkPrev,
      linkNext: linkNext,
      isIndex: true,
      indexCount: step,
    };

    // final rendered page with html and data
    const htmlRender = nunjucks.renderString(template, indexPage);

    // write the file back to disk, at the moment, flat file structure
    fs.writeFileSync(outFolder + "/" + indexFilename, htmlRender);
    // console.log(outFolder + "/" + indexFilename + " written.");
  }

  let pageIndex = 0;
  // console.log(
  //   "pages:",
  //   pages.map(page => page.pageTitle)
  // );

  pages.forEach((page) => {
    //previous and next links
    let linkPrev = null,
      linkNext = null;
    if (pages[pageIndex + 1]) {
      linkPrev = pages[pageIndex + 1].pageLink;
    }
    if (pages[pageIndex - 1]) {
      linkNext = pages[pageIndex - 1].pageLink;
    }

    // attach all items to history for in page rendering.
    page.history = pages;
    page.pageIndex = pageIndex;
    page.linkPrev = linkPrev;
    page.linkNext = linkNext;

    // final rendered page with html and data
    const htmlRender = nunjucks.renderString(template, page);

    // write the file back to disk, at the moment, flat file structure
    fs.writeFileSync(outFolder + "/" + page.filename, htmlRender);

    p.addRow(
      {
        Filename: truncate(page.filename, 60, '...'),
        Written: new Date(page.pageDate).toLocaleDateString(),
      },
      { color: "green" }
    );

    pageIndex++; //add one to the page index
  });
  p.printTable();
  console.log(`${pages.length} musings written.`);
  // console.timeEnd('Build time')
  var end= Date.now();
  var timeSpent=(end-begin)/1000+" seconds";
  console.log(`${timeSpent} build time.`);


}

function build(siteConfig) {
  try {
    fs.copySync(
      siteConfig.input + "/assets/images",
      siteConfig.output + "/assets/images"
    );
    fs.copySync(
      "musings/themes/" + siteConfig.theme + "/assets/css",
      siteConfig.output + "/assets/css"
    );
    fs.copySync(
      "musings/themes/" + siteConfig.theme + "/assets/js",
      siteConfig.output + "/assets/js"
    );
    const tree = dirTree(siteConfig.input);
    if (siteConfig && tree.children && siteConfig.input && siteConfig.output) {
      this.render(
        tree.children,
        siteConfig.input,
        siteConfig.output,
        siteConfig
      );
    }
  } catch (err) {
    console.error(err);
  }
}

function deploy(appDirIn, appDirOut, siteConfig) {
  AWS.config.loadFromPath("./aws.credentials.json");

  let awsS3Client = new AWS.S3();
  let client = s3.createClient({
    s3Client: awsS3Client,
  });

  console.log(`${process.cwd()}\\${appDirOut}`);

  let params = {
    localDir: `${process.cwd()}\\${appDirOut}`,
    deleteRemoved: true,
    s3Params: {
      Bucket: siteConfig.deploy.s3Bucket,
      Prefix: "",
    },
  };

  let uploader = client.uploadDir(params);
  uploader.on("error", function (err) {
    console.error("unable to sync:", err.stack);
  });
  uploader.on("progress", function () {
    console.log("progress", uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on("end", function () {
    console.log("done uploading");
  });
}

module.exports = {
  render: render,
  build: build,
  deploy: deploy,
};
