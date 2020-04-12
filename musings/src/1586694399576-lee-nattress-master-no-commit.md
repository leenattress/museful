
[meta-title]: <> (What is museful?)
[meta-date]: <> (2020-04-12T12:26:39.576Z)
[meta-branch]: <> (master)
[meta-commit]: <> (none)
[meta-user]: <> (Lee Nattress)

## Bigger than Commit Messages

When a developer is committing code to a repository, especially with a team, they will push their work as collections of commits. These have timestamps and a description. They are used to describe what happened since the last commit, so other developers can see the timeline of things unfolding.

The problem is that developers (myself included) make terrible commit messages, and worse, they are so far apart that it's not possible to describe the changes in a meaningful way.

What I wanted to do was talk in-depth about the things I had created, engineered or changed in a project. Something bigger than the commit messages.

In museful, when you create a new musing, your current branch, commit and username get stored in the file as well. We can then use this meta-data to build a website, rich with information, from a stream of musings I called, the timeline.

This can be done in any project with a `package.json` file. Any developers can contribute, at any time, thoughts about their work and their reasoning.

Since these musings are markdown files and they are now present in the source, the musings follow the source, and they are up for both peer review and consumption. Other developers can read your musings as they review pull requests.

They can also be collated into a simple blog type website and consumed by a wider audience, such as fanatical followers of your software.

Blogging from inside a project.

I hope this explains what museful is, but who can use it.

## Who is this for?

Well, for starters, developers who need to talk about the parts of development they are currently part of. The challenges they have solved and the problems they face so that others might learn from their success or failure.

A tester might talk about the part of the application they are testing today, or scripts they are writing, or techniques they are using.

A business analyst might write about how the application is unfolding and the reasoning behind any features they require.

There is a lot of discussions and thoughts flying around during a project. Some of them can be used to guide the software, your team, or even the company.

So let's get them out of our heads, and into our repo.