import { Store, set, get, clear } from 'idb-keyval';

const store = new Store('memfetch', 'memfetch');

let allow = '*';

try {
  allow = document.lastChild.src.split('?')[1];
} catch (e) {
  //noop
}

async function init() {
  const _fetch = window.fetch;

  console.warn(
    'Using dev-fetch to override normal fetch behaviour. Make sure this does not land in production'
  );

  if (_fetch.__patched) return;

  const createKey = (url, options) => JSON.stringify({ url, options });

  const fetch = async (string, options) => {
    if (allow !== '*' && !string.includes(allow)) {
      return _fetch(string, options);
    }

    const key = createKey(string, options);

    const cached = await get(key, store);

    if (cached) {
      const { body, status, statusText, headers } = cached;
      return Promise.resolve(
        new Response(body, { status, statusText, headers })
      );
    }

    return _fetch(string, options).then(async res => {
      const headers = Array.from(res.headers.entries()).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {}
      );
      const { status, statusText } = res;

      const body = await res.blob();
      const response = new Response(body, { status, statusText, headers });

      set(key, { headers, status, statusText, body, options }, store);

      return response;
    });
  };

  Object.defineProperty(fetch, 'seed', {
    set: async newSeed => {
      const seed = await get('seed', store);
      if (newSeed != seed) {
        console.log('clearing cache');
        await clear(store);
        await set('seed', newSeed, store);
        return true;
      }
      return false;
    },
    get: async () => await get('seed', store),
  });

  fetch.__patched = true;

  window.fetch = fetch;
}

init();
