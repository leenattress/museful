
[meta-title]: <> (Automatically extracting the title)
[meta-date]: <> (2020-04-11T11:29:31.292Z)
[meta-branch]: <> (master)
[meta-commit]: <> (none)
[meta-user]: <> (Lee Nattress)


In the museful editor, we use markdown. This means we can use the hashtag # to denote a title.

When the creator muses a document where the first line has a single hash, we assume this is the title and we set that in the metadata.

I think this is a nice quality of life feature, and this means that the markdown API returns the title, in the JSON response.