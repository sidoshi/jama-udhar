/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-2ae722a1'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "cf1ad11e9a17e50fa80b832da1dee350"
  }, {
    "url": "pwa-512x512.png",
    "revision": "94eb8c99fba9d5146b7016edaf63fd17"
  }, {
    "url": "pwa-192x192.png",
    "revision": "c6c0ff0834f4b08c87612acb5385b60f"
  }, {
    "url": "index.html",
    "revision": "0b41cd5c04ab906f4eae666a5cddba92"
  }, {
    "url": "icon.svg",
    "revision": "dbda30735f5444f8e10e388320437e26"
  }, {
    "url": "favicon.ico",
    "revision": "04dd8a3de694d0223c63d794b32d86ed"
  }, {
    "url": "assets/roboto-vietnamese-700-normal-iKxYNAzq.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-vietnamese-500-normal-HYpufUYk.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-vietnamese-400-normal-CDDxGrUb.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-vietnamese-300-normal-CNeuLW5X.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-symbols-700-normal-rJi6RjIy.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-symbols-500-normal-BXFTxrNR.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-symbols-400-normal-fF1SLJBj.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-symbols-300-normal-BtHl5mYl.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-math-700-normal-VUAI6Bz2.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-math-500-normal-CFNaIMFC.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-math-400-normal-B3wgz80t.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-math-300-normal-BMxwzQmU.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-latin-ext-700-normal-70GS1MYH.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-latin-ext-500-normal-C_ARlJGk.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-latin-ext-400-normal-ZYmyxeOy.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-latin-ext-300-normal-BOz0oSmX.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-latin-700-normal-CXeAXeti.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-latin-500-normal-CkrA1NAy.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-latin-400-normal-CNwBRw8h.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-latin-300-normal-CztWkFGs.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-greek-700-normal-BcGn9doz.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-greek-500-normal-BJMS0heP.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-greek-400-normal-jFM2czAU.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-greek-300-normal-Cnub06j7.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-cyrillic-ext-700-normal-UFn0vR9r.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-cyrillic-ext-500-normal-B7rQpwPu.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-cyrillic-ext-400-normal-DzMWdK87.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-cyrillic-ext-300-normal-CUPJdUZp.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-cyrillic-700-normal-BiSG5NnW.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-cyrillic-500-normal-hCeO1jFL.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-cyrillic-400-normal-DAIM1_dR.woff2",
    "revision": null
  }, {
    "url": "assets/roboto-cyrillic-300-normal-BoeCr7ev.woff2",
    "revision": null
  }, {
    "url": "assets/index-Drru4AXA.js",
    "revision": null
  }, {
    "url": "assets/index-Cbl02gOy.css",
    "revision": null
  }, {
    "url": "favicon.ico",
    "revision": "04dd8a3de694d0223c63d794b32d86ed"
  }, {
    "url": "pwa-192x192.png",
    "revision": "c6c0ff0834f4b08c87612acb5385b60f"
  }, {
    "url": "pwa-512x512.png",
    "revision": "94eb8c99fba9d5146b7016edaf63fd17"
  }, {
    "url": "manifest.webmanifest",
    "revision": "b56c1e89de64323e07275b7f7ee27a08"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), {
      cacheKeyWillBeUsed: async ({
        request
      }) => {
        return `${request.url}?v=${(new Date()).toISOString().slice(0, 10)}`;
      }
    }]
  }), 'GET');

}));
