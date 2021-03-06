![header.png](header.png)
<p>
  <a href="https://www.npmjs.com/package/museful" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/museful.svg">
  </a>
  <a href="https://github.com/leenattress/museful#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/leenattress/museful/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/leenattress/museful/blob/master/LICENSE" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/github/license/leenattress/museful" />
  </a>
  <a href="https://twitter.com/leenattress" target="_blank">
    <img alt="Twitter: leenattress" src="https://img.shields.io/twitter/follow/leenattress.svg?style=social" />
  </a>
</p>

> museful is a terminal application that lets developers on a project have more meaningful discussion with anybody interested in the source code than just commit messages.

### 🏠 [Homepage](https://github.com/leenattress/museful)

## Install

```sh
npm i museful -g
```

## Add to Project

To get started, add a `musings` folder to your project. This command must be typed in the root of your project, where your `package.json` lives.

```sh
museful init
```

## Create a musing

This will start a web interface and prompt for your thoughts. You can toggle the markdown preview here and then save to your `musings` folder by pressing the button at the bottom. Your musing will be saved to `/musings/src`.

```sh
museful new
```

## See Timeline

You can view all the musings from all the members of your team here. A browser window will open to the _timeline_.

```sh
museful
```

## Build for CI/CD

```sh
museful build
```

To build your teams musings into a website that you can deploy to a web server, run this command. It will give you a report on how it all went. Your site will be built into `/docs` by default, but you easily change this in your `museful.json`. This is a comfortable place for [GitHub Pages](https://pages.github.com/) because it means you can deploy this to the web with a couple of clicks.

![github pages helper image](readme-github-pages.png)

Of course you can use:

- [AWS s3](https://github.com/import-io/s3-deploy)
- [Zeit Now](https://zeit.co/)
- [Surge.sh](https://surge.sh/)

Whichever suits your taste for hoisting _static content_.

The musings from this very project are stored here: __[https://leenattress.github.io/museful/](https://leenattress.github.io/museful/)__

## What do we add to your project?

We add a single folder called musings, and everything is inside. We keep a config file called `museful.json` in there that stores some settings you can configure, as well as a theme folder that you can edit yourself.

![musings-folder.png](musings-folder.png)

## Features

- Create a timeline of thoughts, or discussion inside your project
- Content is markdown text
- Easily edit with the provided web interface, or in your favourite markdown, text editor or development IDE
- Generate a website for public (or team) to read.
- No database, very simple to set up and use
- Super simple single command: `museful`
- Musings are committed along with code for review

## Themes

To learn more about changing the look of your public facing `musings` check this short themes guide out:

[Learn more about museful themes](themes.md)

---

![images\museful-markdown.png](museful-markdown.png)

## Current Project State

This is an early release and might not be ready for production right now due to bugs and other madness.

## Author

👤 **Lee Nattress (http://leenattress.com)**

* Twitter: [@leenattress](https://twitter.com/leenattress)
* Github: [@leenattress](https://github.com/leenattress)
* LinkedIn: [@leenattress](https://linkedin.com/in/leenattress)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/leenattress/museful/issues). You can also take a look at the [contributing guide](https://github.com/leenattress/museful/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/leenattress">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

<a href="https://ko-fi.com/leenattress">
  <img src="https://i.imgur.com/afJzsuz.png" width="160">
</a>


## 📝 License

Copyright © 2020 [Lee Nattress <leenattress1981@gmail.com> (http://leenattress.com)](https://github.com/leenattress).<br />
This project is [ISC](https://github.com/leenattress/museful/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_