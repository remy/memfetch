# memfetch

An unobtrusive development library for caching and returning fetch requests.

The concept is that the library is included for development to reduce external API requests (particularly around rate-limiting) and to reduce latency, whilst making it easy to remove the library when ready for development.

## Usage

You can include the library via an npm install, or I'd recommend a simple script include:

```html
<script src="https://unpkg.com/memfetch"></script>
```

As long the script is before your own code, all requests using `fetch` will be cached and served via IndexedDB subsequently.

## Only caching specific URLs

Since memfetch doesn't play nicely with things like Hot Module Reload, you can specify to only allow memfetch to handle matching URLs. To do so, include a string fragment in the query string of the script include. This method (below) will cache any URL that includes `api` in the string:

```html
<script src="https://unpkg.com/memfetch?api"></script>
```

## Clearing / resetting the cache

The memfetch wrapper also provides a property called `seed`. Upon setting the value, or changing it (between sessions) will completely empty the cache.

## License

- [MIT](https://rem.mit-license.org)
