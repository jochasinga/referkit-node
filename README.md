# Alphaseek.js

JavaScript/TypeScript library for building a referral campaign with [Alphaseek SDK](http://alphaseek.io).

## Install

```shell

npm install alphaseek

```

## Getting started

In your project, authenticate (login) in the appropriate module to retain the access token, which will be useful later.

```javascript

import {Auth} from 'alphaseek';

async function init() {
  let auth = new Auth();
  await auth.login('joe@alphaseek.io', 'secretpass1234');

  // Now we can use auth instead of raw token, which
  // atomically keeps track of the signed-in state.
  let product = new Product('alphaseek.io', {auth});

  // Save product
  product = await prod.create();

  let user = await new User('user1@gmail.com', {product, from: '916hqpB7'}).create();

  // Get user's unique referral link and code
  const {url, moniker, score, referrer} = user.referral;

  console.log(url); // https://alphaseek.me/i/99PpQrh7
  console.log(moniker); // 99PpQrh7
  console.log(score); // 1
  console.log(referrer.referral.moniker); // 916hqpB7
}

```

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
