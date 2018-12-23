# memfetch

An unobtrusive development library for caching and returning fetch requests.

The concept is that the library is included for development to reduce external API requests (particularly around rate-limiting) and to reduce latency, whilst making it easy to remove the library when ready for development.

## Usage

You can include the library via an npm install, or I'd recommend a simple script include:

```html
<script src="https://unpkg.com/memfetch"></script>
```

As long the script is before your own code, all requests using `fetch` will be cached and served via IndexedDB subsequently.


## Clearing / resetting the cache

The memfetch wrapper also provides a property called `seed`. Upon setting the value, or changing it (between sessions) will completely empty the cache.

## License

- [MIT](https://rem.mit-license.org)
