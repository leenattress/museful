#!/usr/bin/env node

// git things
const userName = require('git-user-name');
const slugify = require('slugify');
const getRepoInfo = require('git-repo-info');
const git = getRepoInfo();

//colourful console
const chalk = require('chalk');
const ctx = new chalk.constructor({level: 0});

//arguments and app name
const args = process.argv.slice(2); //remove the first two things in the args
const appName = 'museful';

const c = console.log;

//file writing helpers
const fs = require('fs-extra');
const appRoot = require('app-root-path');

// museful app functions
const museful = require('./museful.js');

//package json details in app
const pjson = require('./../package.json');

// src and dest folddres for markdown and html
const appDirIn = '';
const appDirOut = '';

//for deployment
var s3 = require('s3');
var AWS = require('aws-sdk');
var s3EasyDeploy = require('s3-easy-deploy');

function showError() {
c(chalk.red(`
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
`));
}
function showTitle() {
c();

c(chalk.hex('#EEEEEE')(`• ▌ ▄ ·. ▄• ▄▌.▄▄ · ▄▄▄ .·▄▄▄▄• ▄▌▄▄▌  `));
c(chalk.hex('#EEEEEE')(`·██ ▐███▪█▪██▌▐█ ▀. ▀▄.▀·▐▄▄·█▪██▌██•  `));
c(chalk.hex('#EEEEEE')(`▐█ ▌▐▌▐█·█▌▐█▌▄▀▀▀█▄▐▀▀▪▄██▪ █▌▐█▌██▪  `));
c(chalk.hex('#EEEEEE')(`██ ██▌▐█▌▐█▄█▌▐█▄▪▐█▐█▄▄▌██▌.▐█▄█▌▐█▌▐▌`));
c(chalk.hex('#EEEEEE')(`▀▀  █▪▀▀▀ ▀▀▀  ▀▀▀▀  ▀▀▀ ▀▀▀  ▀▀▀ .▀▀▀ `));
                                                                                                                
    c(chalk.bold.green(`-=| Share your thoughts as you code |=-`));
    c(chalk.bold.white(`              - v${pjson.version} -`));

showHelp();
c();
}

function showHelp() {
  c(chalk.yellow(`
Try these commands:`));
  c(chalk.magenta(`${appName} init`), chalk.blue(`   - Adds museful to this project`));
  c(chalk.magenta(`${appName} new`), chalk.blue(`    - Adds a musing to the project`));
  c(chalk.magenta(`${appName} deploy`), chalk.blue(` - Send your teams musings to the clouds`));
  c(chalk.magenta(`${appName} build`), chalk.blue(`  - Generate html in the output folder`));
}

function getConfig() {

  const jsonConfigPath = './musings/museful.json';

  if (fs.existsSync(jsonConfigPath)) {
    c(chalk.green('museful config found:'));
    c(chalk.green(jsonConfigPath));
    return JSON.parse(fs.readFileSync(jsonConfigPath));
  } else {
    showError();
    c(chalk.red('museful config not found.'));
    c(chalk.red('It should be in the root of the project'));
    c(chalk.red('in a folder called musings.'));
    c(chalk.magenta(`${appName} init`), chalk.blue(`   - Adds museful to this project`));
    process.exit();
  }
}

if (args[0]) { //we need a command to run anything at all
  const command = args[0]; //

  if (!['help', 'init', 'new', 'deploy', 'build'].includes(command)) {
    showError();
    c(chalk.red('You gave a command that does not exist.'));
    showHelp();
  }
  let subject = null;
  if (args[1]) {
    subject = args[1];
  }
  if (args[2]) {
    showError();
    c(chalk.red('Too many commands, you give a single command and a subject'));
    showHelp();
    process.exit();
  }

  // this command creates required configs and folders in the current folder
  if (command === 'help') {
    showTitle();
  }
  // this command creates required configs and folders in the current folder
  if (command === 'init') {
    subject = 'musings';

    //send payload to new blog directory
    fs.copySync(appRoot + '/payload', subject);

    c(chalk.green(`
✔️ Created thoughts folder: ${subject}`));
    c(chalk.yellow(`
Try this:`));    
    c(chalk.magenta(`${appName} new`), chalk.blue(`    - Adds a musing to the project`));

    process.exit();
  }

  // This command creates a page with the correct headers in the input folder
  if (command === 'new') {
    const timeNow = Date.now();
    if (!!userName()) {
      subject = timeNow + '-' + slugify(userName(), {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        lower: true      // convert to lower case, defaults to `false`
      });

      if (fs.existsSync('./musings/museful.json')) {
      
        const now = new Date().toISOString();
        const markdownContent = `
[meta-date]: <> (${now})
[meta-title]: <> (Page Title)
[meta-branch]: <> (${git.branch})
[meta-sha]: <> (${git.abbreviatedSha ? git.abbreviatedSha : '(none)'})

# Branch: ${git.branch}

## Commit: ${git.abbreviatedSha ? git.abbreviatedSha : '(none)'}

- What part of the code are you working on now?
- What problem have you just solved?
- Are there any code snippets you're particularly proud of?

\`\`\`want to share them?\`\`\`

`;

        const appDirIn = getConfig().input;

        const fileName = appDirIn + '/' + subject + '.md';
        console.log('FILENAME '+ fileName);
          if (fs.existsSync(fileName)){
            showError();
            c(chalk.red('Musing already exists'));
            process.exit()
          }

          fs.writeFileSync(fileName, markdownContent, 'utf8', function (err) {
              if (err) {
                  c(`An error occured while writing ${fileName} config to File.`);
                  return c(err);
              }

              c(chalk.green(`${subject}.md markdown created`));
          });

          c(chalk.green('Creating musing: ' + subject));

      } else {
        console.log('error: run from project root')
      }

    }

    process.exit()
  }
  if (command === 'deploy') {
    const siteConfig = getConfig();
    c(chalk.green('Deploying'), siteConfig.title);
    // deploy to public bucket
      s3EasyDeploy.deploy({
          publicRoot: `${process.cwd()}\\${appDirOut}`,
          bucket: siteConfig.deploy.s3Bucket,
          acl: 'public-read',
          region: siteConfig.deploy.s3Region
      }, function(error, result) {
          if (error) { console.log(error); }
          if (result) { console.log(result); }
      });
  }
  if (command === 'build') {
    const siteConfig = getConfig();
    c(chalk.green('Building'), siteConfig.title);
    museful.build(appDirIn, appDirOut, siteConfig);
    process.exit()
  }


} else {
  showTitle();
  process.exit()
}
