# Alphaseek.js

JavaScript/TypeScript library for building referral with [Alphaseek SDK](http://alphaseek.io).

## Authentication

To log into your account, use `Auth` static class.

```js

import {Auth} from 'alphaseek';

let token = await Auth.login('joe@awesome.app', 'secretPassword');

```

The token will also be stored in-memory as a static variable in the `Auth` class.

If you'd like to use the browser's localStorage to store the access token, set `Auth.useLocalStorage = true` before logging in.

To log out (invalidate the access token):

```js

let ok = await Auth.logout();

```

This also clears old token from the localStorage if `Auth.useLocalStorage` is set to `true`.

If you aren't using localStorage, create a singleton instance of the `Auth` object so you could pass it around in other calls.

```js

let auth = new Auth().login('joe@awesome.app', 'secretPassword');

// Create a new product.
let prod = new Product({domain: 'awesome.io', auth});

```