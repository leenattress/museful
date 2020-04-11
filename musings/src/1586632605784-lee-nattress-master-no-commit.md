
[meta-title]: <> (Highlighting code blocks with highlight.js)
[meta-date]: <> (2020-04-11T19:16:45.784Z)
[meta-branch]: <> (master)
[meta-commit]: <> (none)
[meta-user]: <> (Lee Nattress)


When the template is built, we include some cdn hosted highlighting library.

Our markdown editor automatically wraps code in the correct html to make it all work.

```html
    <link
      rel="stylesheet"
      href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/styles/dracula.min.css"
    />
    <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/highlight.min.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>
```

Beautiful highlighting!