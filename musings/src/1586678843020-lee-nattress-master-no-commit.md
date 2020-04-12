
[meta-title]: <> (Refactoring)
[meta-date]: <> (2020-04-12T08:07:23.020Z)
[meta-branch]: <> (master)
[meta-commit]: <> (none)
[meta-user]: <> (Lee Nattress)


I've spent some time refactoring the code for the various parts of the app. I've noticed in my excitement to get things working, I've made some serious spaghetti code.

If I was under peer review, this would not happen, but because this is a lone project right now, and I'm in dreamer mode, it happened anyway.

So let's go back and fix some of it.

Firstly, and perhaps most obvious is that there are too many nested and useless branching statements. It's _if_ city here.

Then a few different ways of doing something, and I've made functions that do similar things in different files. Let's pull those into the same file, or at least make them unique.

There are few standards in error messages, in fact, two different types of error, so let us sort that.

Some of the CSS colours and theme designs and padding were not unified. Let's fix those.

There are endless ways to refactor code but at some point, you'll feel more comfortable and happier with the way it feels.