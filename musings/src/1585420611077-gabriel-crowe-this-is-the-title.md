[meta-date]: <> (2020-03-28T18:36:51.077Z)
[meta-branch]: <> (master)
[meta-commit]: <> (e8b72ed721)
[meta-user]: <> (Lee Nattress)

# Flat files instead of a database

## What I'm working on
I'm working on the API of museful.

## I've solved a problem
Reading and creating markdown files in nodejs.

```javascript
app.post("/musings", async function(req, res) {
  try {
    if (req.body.title && req.body.content) {
      const id = await createMusing(req.body);
      res.json({ status: "ok", id });
    } else {
      throw "title and content are required";
    }
  } catch (error) {
    res.status(500).send({ status: "heck", error });
  }
});
```

## Lessons learned
It is possible to create an API that does not have a database behind it, but merely any other kind of store. In this case, I can CRUD text files that are in fact markdown.

We expose this functionality though a REST api, and it looks like we are dealing with a data service or some kind, but actually, its just files.
