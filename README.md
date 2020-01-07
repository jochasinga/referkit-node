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

To log into your account, use `Auth` class.

```js

import {Auth} from 'alphaseek';

let token = await Auth.login('joe@awesome.app', 'secretPassword');

```

The token will be stored in the browser's `localStorage` if it's available and also in-memory as a static variable.

You can opt-out of storing the token in the browser's localStorage by setting `Auth.useLocalStorage = false` before calling `login()`.

To log out (invalidate the access token):

```js

let ok = await Auth.logout();

```

This also clears old token from the localStorage if `Auth.useLocalStorage` is set to `true`.

You can also create an `Auth` singleton instance so you could pass it around in other calls.

```js

let auth = new Auth();
let tok = await auth.login('joe@awesome.app', 'secretPassword');

// Create a new product.
let prod = new Product('awesome.app', {auth});

```
