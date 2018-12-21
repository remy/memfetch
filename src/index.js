import { set, get } from 'idb-keyval';

export default function init() {
  const _fetch = window.fetch;

  console.warn(
    'Using dev-fetch to override normal fetch behaviour. Make sure this does not land in production'
  );

  if (_fetch.__devfetch) return;

  const mapping = ['blob', 'formData', 'json', 'text'];

  const createKey = (url, options) =>
    `dev-fetch:${JSON.stringify({ url, options })}`;

  const fetch = async (string, options) => {
    const key = createKey(string, options);

    const cached = await get(key);

    if (cached) {
      return Promise.resolve(
        new Proxy(cached, {
          get: function(obj, prop) {
            if (mapping.includes(prop)) {
              return () => get(`${key}:result`);
            }
            return obj[prop];
          },
        })
      );
    }

    return _fetch(string, options).then(res => {
      const headers = Array.from(res.headers.entries()).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {}
      );
      const {
        ok,
        redirected,
        status,
        statusText,
        type,
        url,
        useFinalURL,
      } = res;
      set(key, {
        headers,
        ok,
        redirected,
        status,
        statusText,
        type,
        url,
        useFinalURL,
      });
      return new Proxy(res, {
        get: function(obj, prop) {
          if (mapping.includes(prop)) {
            return () =>
              obj[prop]().then(result => {
                set(`${key}:result`, result);
                return result;
              });
          }
          return obj[prop];
        },
      });
    });
  };

  fetch.__devfetch = true;

  window.fetch = fetch;
}

init();
