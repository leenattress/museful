const musingFolder = "musings/src/";
const slugify = require("slugify");
const amount = 100;

const faker = require("faker");
const fs = require("fs-extra");

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

var i;
for (i = 0; i < amount; i++) {
  const timeNow = Date.now();
  const userName = faker.name.findName();
  const commitHex = Math.floor(Math.random() * 16777215).toString(16);
  const gitBranch = `${faker.random.arrayElement([
    "bug",
    "feature",
    "wip"
  ])}/${slugify(faker.company.bsAdjective())}`;
  const date = randomDate(new Date(2018, 0, 1), new Date()).getTime();
  saveFileName =
    musingFolder +
    date +
    "-" +
    slugify(userName + "-" + gitBranch + "-" + commitHex, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      lower: true // convert to lower case, defaults to `false`
    }) +
    ".md";

  const markdownContent = `
[meta-date]: <> (${new Date(date).toISOString()})
[meta-branch]: <> (${gitBranch})
[meta-commit]: <> (${commitHex})
[meta-user]: <> (${userName})

# ${faker.company.bs()}

${faker.lorem.paragraphs(2, "\n\r\n\r")}
`;
  fs.writeFileSync(saveFileName, markdownContent);
  console.log(saveFileName);
  console.log("---");
}
