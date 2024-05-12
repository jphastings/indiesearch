# IndieSearch

This is a _very_ early prototype of a browser extension for distributed search for the IndieWeb.

More coming here soon; but please reach out to me at [byjp.me](https://www.byjp.me) if you want more context in the meanwhile.

## Demo

https://github.com/jphastings/indiesearch/assets/42999/b1042abe-6aef-4157-bc08-770cfd3becfc

This demo shows:
- 🖱️ Accessing the search page direct from your extensions list
- 😔 Performing a search with no sites in your IndieSearch index (no results!)
- 🤓 (Cheatcode) Using a quick hack to add the PageFind site's search to the local index (these wouldn't be present in a proper build)
- 🔍 Searching for the word "hello" (Lots of hits of pagefind.app!)
- ❌ Marking that newly added site to be excluded from future searches
- 🤓 (Cheatcode) Adding a search index for the XKCD site to the local index
- 🔍 Searching for the word "hello" (includes XKCD but _not_ PageFind, as it's excluded)
- 🌐 Visiting my blog
- ✨ My site is automatically added to your search index as a new site (it has the magic header!)
- 🔍 Searching for the word "hello" (includes results from my blog and XKCD, but still not PageFind)

## How it works

[PageFind](https://pagefind.app) is a combination of a search index builder (in Rust) and a browser-side search algorithm (in Javascript) that allows for low-bandwidth, static site searches. It has a neat feature that allows searching across multiple loaded indexes, which IndieSearch makes use of.

While this (demo!) extension is active & has permissions, it will look for HTML `link` tags like the one below, and will extract the `href` (where the PageFind search index is) and the `title` (from the same tag, or from the page, as a fallback) — storing _just those pieces of information_ in your 'local search index'.

```html
<link rel="search" type="application/pagefind" href="/search" title="byJP">
```

These pieces of information (along with the extension's configuration UI, which allows you to manage which sites remain in your index) then get fed into a `PageFindUI` instance (run from within the extension) which will make queries for the appropriate parts of the search index from any site in your local search index — offering you the results without any centralised queries.

## Get hacking

To get this going on your machine you should be able to:

```sh
cd Extension
npm run generate:icons
npm run build
```

And then "load the unpacked extension" of the `Extension` directory (not the `dist` directory, its parent).

## Honours

This has been thrown together incredibly quickly because of the excellent work by [kyle-n](https://github.com/kyle-n) and their [WebExtensionTemplate](https://github.com/kyle-n/WebExtensionTemplate). Thank you!
