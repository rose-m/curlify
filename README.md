# curlify
WebExtension based browser addon to generate CURL request including all cookies.

This extension adds an action button which upon click will generate a `curl` command for the tab's current URL including *all* cookies
available for the site, i.e. *including HTTP only* cookies. Essentially this is for hijacking your own session towards CURL.

## Development

First install all required packages:

```
$ npm install
```

There are two different tasks available to build the extension either for Chrome or Firefox. Before building I recommend running:

```
$ npm run clean
```

Afterwards just use `build:firefox` or `build:chrome` to create all necessary files and structures, e.g. for Firefox:

```
$ npm run build:firefox
```

After building either install it directly inside Chrome or for Firefox you can use [`web-ext`](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext) to try the extension immediately.
