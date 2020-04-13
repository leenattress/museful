
[meta-title]: <> (Why museful exists)
[meta-date]: <> (2020-04-13T12:42:12.775Z)
[meta-branch]: <> (master)
[meta-commit]: <> (none)
[meta-user]: <> (Lee Nattress)


Making software is documented all over the place, all the different strategies, and techniques, all the languages, and methodologies.

They all share a commonality, and this is, the source code, is stored somewhere. The code that builds the product. It's either compiled, or it runs just in time, or a mixture of both. One thing is for certain, you keep it in git, or subversion, or mercurial.

Sometimes you even work as a team on the same project, or a project owner is a lone warrior.

If you work as a team then you could do peer reviews. Whatever your version control system calls it, when you want to merge your code into somewhere meaningful, people would inspect it for errors and issues.

This isn't something new, it has been this way for a very long time.

When code is committed to version control, you usually comment on what you did. Me? I'm terrible at this. My comments are brief and don't cover all the points, mainly because for some reason, pushing the code up there is just some time-consuming punishment, or something let over to do after the meat of actually writing code.

So what might happen if I had more space to write, and that writing something was a ritual, and something meaningful that I know more people might read?

If I knew that the things I might write would be taken in by others and that real worth might be derived from my thoughts as I code it's possible I might be inclined to share my thoughts, ideas, and discoveries, as well as failures.

If I know they would be useful.

Commit messages are not enough for me. I want to show you images and diagrams, I want to show you HTML snippets and a clever function I used.

Where is the place for that? A wiki? Confluence?

These are places outside the project. They are disconnected by being in separate systems. No, I need something inside the project itself. I want to keep my discussion, my dreamings, with the project like a treasure trove for further engineers to discover, or even share my revelations with the user, so they can see my insights and the reasons I did this thing, this way.

I created museful for this.

museful is a terminal application written in javascript. You can install it trivially with npm, and it will help you get the ideas out of your head and into the minds of other dreamers.

It provides a browser interface to both reads and creates text documents, formatted with markdown (and HTML) that live inside your version control repository. When you commit your code and submit a pull request, your new thoughts will be alongside the code. People will be able to read why you did something this way.

museful provides a way to build the musings into a web site, that you can deploy any place you choose (or simply don't, it's your call). You can make your team's skills and ideas public, to excite fanatical fans. Keeping users in the loop is a very powerful tool.

museful has a load of clever features like theming and markdown previews and all that, but it's all down to the idea, that this 'blog' of sorts will run concurrently with your source code. We even tag the musings with the current branch and commit hash.
This timeline will stay with the software.
I hope this explains why I made museful and why I want you to try it in your project. Set aside sometime before your pull request to write about what you did. Maybe somebody might learn something from you, and this is amazing.