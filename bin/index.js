#!/usr/bin/env node

// to open a browser
const open = require("open");

// git things
const userName = require("git-user-name");
const slugify = require("slugify");
const getRepoInfo = require("git-repo-info");
const git = getRepoInfo();

//colourful console
const chalk = require("chalk");
const ctx = new chalk.constructor({ level: 0 });

//arguments and app name
const args = process.argv.slice(2); //remove the first two things in the args
const appName = "museful";

const c = console.log;

//file writing helpers
const fs = require("fs-extra");
const appRoot = require("app-root-path");

// museful app functions
const museful = require("./museful.js");

//package json details in app
const pjson = require("./../package.json");

// src and dest folddres for markdown and html
const appDirIn = "";
const appDirOut = "";

//for deployment
var s3 = require("s3");
var AWS = require("aws-sdk");
var s3EasyDeploy = require("s3-easy-deploy");

function showError() {
  c(
    chalk.red(`
            ░▓▓▓░
           ░▓    ░
          ░▓ ░░░▒ ░
         ░▓ ░░░░░▒ ░
        ░▓ ░░   ░░▒ ░
       ░▓ ░░░   ░░░▒ ░
      ░▓ ░░░░   ░░░░▒ ░
     ░▓ ░░░░░   ░░░░░▒ ░
    ░▓ ░░░░░░   ░░░░░░▒ ░
   ░▓ ░░░░░░░░░░░░░░░░░▒ ░
  ░▓ ░░░░░░░░   ░░░░░░░░▒ ░
 ░▓ ░░░░░░░░░░░░░░░░░░░░░▒ ░
 ░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░
`)
  );
}
function showTitle() {
  c();

  c(chalk.hex("#EEEEEE")(`• ▌ ▄ ·. ▄• ▄▌.▄▄ · ▄▄▄ .·▄▄▄▄• ▄▌▄▄▌  `));
  c(chalk.hex("#EEEEEE")(`·██ ▐███▪█▪██▌▐█ ▀. ▀▄.▀·▐▄▄·█▪██▌██•  `));
  c(chalk.hex("#EEEEEE")(`▐█ ▌▐▌▐█·█▌▐█▌▄▀▀▀█▄▐▀▀▪▄██▪ █▌▐█▌██▪  `));
  c(chalk.hex("#EEEEEE")(`██ ██▌▐█▌▐█▄█▌▐█▄▪▐█▐█▄▄▌██▌.▐█▄█▌▐█▌▐▌`));
  c(chalk.hex("#EEEEEE")(`▀▀  █▪▀▀▀ ▀▀▀  ▀▀▀▀  ▀▀▀ ▀▀▀  ▀▀▀ .▀▀▀ `));

  c(chalk.bold.green(`-=| Share your thoughts as you code |=-`));
  c(chalk.bold.white(`              - v${pjson.version} -`));

  showHelp();
  c();
}

function showHelp() {
  c(
    chalk.yellow(`
Try these commands:`)
  );
  c(
    chalk.magenta(`${appName} init`),
    chalk.blue(`   - Adds museful to this project`)
  );
  c(
    chalk.magenta(`${appName} new`),
    chalk.blue(`    - Adds a musing to the project`)
  );
  c(
    chalk.magenta(`${appName} deploy`),
    chalk.blue(` - Send your teams musings to the clouds`)
  );
  c(
    chalk.magenta(`${appName} build`),
    chalk.blue(`  - Generate html in the output folder`)
  );
}

function getConfig() {
  const jsonConfigPath = "./musings/museful.json";

  if (fs.existsSync(jsonConfigPath)) {
    c(chalk.green(`museful config found: ${jsonConfigPath}`));
    return JSON.parse(fs.readFileSync(jsonConfigPath));
  } else {
    showError();
    c(chalk.red("museful config not found."));
    c(chalk.red("It should be in the root of the project"));
    c(chalk.red("in a folder called musings."));
    c(
      chalk.magenta(`${appName} init`),
      chalk.blue(`   - Adds museful to this project`)
    );
    process.exit();
  }
}

if (args[0]) {
  //we need a command to run anything at all
  const command = args[0]; //

  if (
    !["help", "init", "new", "deploy", "build", "inspire"].includes(command)
  ) {
    showError();
    c(chalk.red("You gave a command that does not exist."));
    showHelp();
  }
  let subject = null;
  if (args[1]) {
    subject = args[1];
  }
  if (args[2]) {
    showError();
    c(chalk.red("Too many commands, you give a single command and a subject"));
    showHelp();
    process.exit();
  }

  // this command creates required configs and folders in the current folder
  if (command === "help") {
    showTitle();
  }
  // this command creates required configs and folders in the current folder
  if (command === "init") {
    subject = "musings";

    //send payload to new blog directory
    fs.copySync(appRoot + "/payload", subject);

    c(
      chalk.green(`
✔️ Created thoughts folder: ${subject}`)
    );
    c(
      chalk.yellow(`
Try this:`)
    );
    c(
      chalk.magenta(`${appName} new`),
      chalk.blue(`    - Adds a musing to the project`)
    );

    process.exit();
  }

  // This command creates a page with the correct headers in the input folder
  if (command === "new") {
    const timeNow = Date.now();
    if (!!userName()) {
      subject =
        timeNow +
        "-" +
        slugify(userName(), {
          replacement: "-", // replace spaces with replacement character, defaults to `-`
          lower: true, // convert to lower case, defaults to `false`
        });

      if (fs.existsSync("./musings/museful.json")) {
        // (async () => {
        //   await open("http://localhost:3000");
        // })();
        //         const now = new Date().toISOString();
        //         const markdownContent = `
        // [meta-date]: <> (${now})
        // [meta-title]: <> (Page Title)
        // [meta-branch]: <> (${git.branch})
        // [meta-sha]: <> (${git.abbreviatedSha ? git.abbreviatedSha : "(none)"})
        // [meta-user]: <> (${userName()})
        // # Branch: ${git.branch}
        // ## Commit: ${git.abbreviatedSha ? git.abbreviatedSha : "(none)"}
        // - What part of the code are you working on now?
        // - What problem have you just solved?
        // - Are there any code snippets you're particularly proud of?
        // \`\`\`want to share them?\`\`\`
        // `;
        //         const appDirIn = getConfig().input;
        //         const fileName = appDirIn + "/" + subject + ".md";
        //         if (fs.existsSync(fileName)) {
        //           showError();
        //           c(chalk.red("Musing already exists"));
        //           process.exit();
        //         }
        //         fs.writeFileSync(fileName, markdownContent, "utf8", function(err) {
        //           if (err) {
        //             c(`An error occured while writing ${fileName} config to File.`);
        //             return c(err);
        //           }
        //           c(chalk.green(`${subject}.md markdown created.`));
        //         });
      } else {
        console.log("error: run from project root");
      }
    }
  }
  if (command === "deploy") {
    const siteConfig = getConfig();
    c(chalk.green("Deploying"), siteConfig.title);
    // deploy to public bucket
    s3EasyDeploy.deploy(
      {
        publicRoot: `${process.cwd()}\\${appDirOut}`,
        bucket: siteConfig.deploy.s3Bucket,
        acl: "public-read",
        region: siteConfig.deploy.s3Region,
      },
      function (error, result) {
        if (error) {
          console.log(error);
        }
        if (result) {
          console.log(result);
        }
      }
    );
  }
  if (command === "build") {
    const siteConfig = getConfig();
    c(chalk.green("Building"), siteConfig.title);
    museful.build(siteConfig);
    process.exit();
  }

  if (command === "inspire") {
    const inspiration = [
      `"Any sufficiently advanced technology is indistinguishable from magic."
- Arthur C. Clarke`,

      `"As soon as it is completed, it will be possible for a business man in New York to dictate instructions, and have them instantly appear in type at his office in London or elsewhere. He will be able to call up, from his desk, and talk to any telephone subscriber on the globe, without any change whatever in the existing equipment. An inexpensive instrument, not bigger than a watch, will enable its bearer to hear anywhere, on sea or land, music or song, the speech of a political leader, the address of an eminent man of science, or the sermon of an eloquent clergyman, delivered in some other place, however distant. In the same manner any picture, character, drawing, or print can be transferred from one to another place. Millions of such instruments can be operated from but one plant of this kind. More important than all of this, however, will be the transmission of power, without wires, which will be shown on a scale large enough to carry conviction."
- Nikola Tesla, On the Wardenclyffe Tower, in "The Future of the Wireless Art" in Wireless Telegraphy and Telephony (1908)`,

      `"I have not failed. I’ve just found 10,000 ways that won’t work."
- Thomas Edison`,

      `"Being the richest man in the cemetery doesn’t matter to me. Going to bed at night saying we’ve done something wonderful, that’s what matters to me."
- Steve Jobs`,

      `"Computers themselves, and software yet to be developed, will revolutionize the way we learn."
- Steve Jobs`,

      `"You never know when a moment and a few sincere words can have an impact on a life"
- Zig Ziglar`,

      `"Software is like entropy: It is difficult to grasp, weighs nothing, and obeys the Second Law of Thermodynamics; i.e., it always increases."
- Norman Augustine`,

      `"Software is a gas; it expands to fill its container."
- Nathan Myhrvold`,

      `"All parts should go together without forcing.  You must remember that the parts you are reassembling were disassembled by you.  Therefore, if you can’t get them together again, there must be a reason.  By all means, do not use a hammer."
- IBM Manual, 1925`,

      `"It’s hardware that makes a machine fast.  It’s software that makes a fast machine slow."
- Craig Bruce`,

      `"Imagination is more important than knowledge.  For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution."
- Albert Einstein`,

      `"The more you know, the more you realize you know nothing."
- Socrates`,

      `"Tell me and I forget.  Teach me and I remember.  Involve me and I learn."
- Benjamin Franklin`,

      `"Real knowledge is to know the extent of one’s ignorance."
- Confucius`,

      `"If people never did silly things, nothing intelligent would ever get done."
- Ludwig Wittgenstein`,

      `"Getting information off the Internet is like taking a drink from a fire hydrant."
- Mitchell Kapor`,

      `"If you think your users are idiots, only idiots will use it."
— Linus Torvalds`,

      `"Your most unhappy customers are your greatest source of learning."
— Bill Gates`,

      `"Let us change our traditional attitude to the construction of programs: Instead of imagining that our main task is to instruct a computer what to do, let us concentrate rather on explaining to human beings what we want a computer to do."
— Donald E. Knuth`,

      `"Pessimists, we’re told, look at a glass containing 50% air and 50% water and see it as half empty.  Optimists, in contrast, see it as half full.  Engineers, of course, understand the glass is twice as big as it needs to be."
— Bob Lewis`,

      `"In a room full of top software designers, if two agree on the same thing, that’s a majority."
— Bill Curtis`,

      `"Mostly, when you see programmers, they aren’t doing anything.  One of the attractive things about programmers is that you cannot tell whether or not they are working simply by looking at them.  Very often they’re sitting there seemingly drinking coffee and gossiping, or just staring into space.  What the programmer is trying to do is get a handle on all the individual and unrelated ideas that are scampering around in his head."
— Charles M. Strauss`,

      `"If you think you are worth what you know, you are very wrong.  Your knowledge today does not have much value beyond a couple of years.  Your value is what you can learn and how easily you can adapt to the changes this profession brings so often."
— Jose M. Aguilar`,

      `"Programs must be written for people to read, and only incidentally for machines to execute."
— Abelson and Sussman`,

      `"Commenting your code is like cleaning your bathroom — you never want to do it, but it really does create a more pleasant experience for you and your guests."
— Ryan Campbell`,

      `"We have to stop optimizing for programmers and start optimizing for users."
— Jeff Atwood`,

      `“Low-level programming is good for the programmer’s soul.”
— John Carmack`,

      `“It’s OK to figure out murder mysteries, but you shouldn’t need to figure out code.  You should be able to read it.”
— Steve McConnell`,

      `“If we wish to count lines of code, we should not regard them as ‘lines produced’ but as ‘lines spent.'”
— Edsger Dijkstra`,

      `“Before software should be reusable, it should be usable.”
— Ralph Johnson`,

      `“If you automate a mess, you get an automated mess.”
— Rod Michael`,

      `“It is easier to change the specification to fit the program than vice versa.”
— Alan Perlis`,

      `“How rare it is that maintaining someone else’s code is akin to entering a beautifully designed building, which you admire as you walk around and plan how to add a wing or do some redecorating. More often, maintaining someone else’s code is like being thrown headlong into a big pile of slimy, smelly garbage.”
— Bill Venners`,

      `“Code generation, like drinking alcohol, is good in moderation.”
— Alex Lowe`,

      `“Simplicity, carried to the extreme, becomes elegance.”
— Jon Franklin`,

      `“A program is never less than 90% complete, and never more than 95% complete.”
— Terry Baker`,

      `“When you are stuck in a traffic jam with a Porsche, all you do is burn more gas in idle.  Scalability is about building wider roads, not about building faster cars.”
— Steve Swartz`,

      `“Everyone by now presumably knows about the danger of premature optimization.  I think we should be just as worried about premature design — designing too early what a program should do.”
— Paul Graham`,

      `“Programming without an overall architecture or design in mind is like exploring a cave with only a flashlight: You don’t know where you’ve been, you don’t know where you’re going, and you don’t know quite where you are.”
— Danny Thorpe`,

      `“The best way to predict the future is to implement it.”
— David Heinemeier Hansson`,

      `“Today, most software exists, not to solve a problem, but to interface with other software.”
— IO Angell`,

      `“Good specifications will always improve programmer productivity far better than any programming tool or technique.”
— Milt Bryce`,

      `“Don’t document the problem, fix it.”
— Atli Björgvin Oddsson`,

      `“As a rule, software systems do not work well until they have been used, and have failed repeatedly, in real applications.”
— Dave Parnas`,

      `“If the code and the comments do not match, possibly both are incorrect.”
— Norm Schryer`,

      `“When debugging, novices insert corrective code; experts remove defective code.”
— Richard Pattis`,

      `“In a software project team of 10, there are probably 3 people who produce enough defects to make them net negative producers.”
— Gordon Schulmeyer`,

      `“It was a joke, okay?  If we thought it would actually be used, we wouldn’t have written it!”
— Mark Andreesen, speaking of the HTML tag BLINK`,

      `“You can make more friends in two months by becoming interested in other people than you can in two years by trying to get other people interested in you”
- Dale Carnegie`,
    ];

    const randomNumber = Math.floor(Math.random() * inspiration.length);

    c(chalk.green(inspiration[randomNumber]));
  }
} else {
  const app = require("./../api/server");
  (async () => {
    await open("http://localhost:3000");
  })();
}
