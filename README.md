# referkit

![npm](https://img.shields.io/npm/v/referkit)
![Twitter URL](https://img.shields.io/twitter/url?url=https%3A%2F%2Ftwitter.com%2Freferkit)

TypeScript/JavaScript adapter for integrating referral programs with [Referkit API](https://referkit.io).

## Sign up

Please make sure you have [signed up with Referkit][signup] and have your email and password ready.

[signup]: https://alphaseek.typeform.com/to/kBUVWb

## Install

```shell

npm i referkit

```

## Getting started

In your project, authenticate (login) in the appropriate place to get an `Auth` instance, which will be used to authenticate a `Product`.

```javascript

import {Auth} from 'referkit';

async function init() {
  const auth = new Auth();
  await auth.login('joe@alphaseek.io', 'secretpass1234');

  // Now we can use auth instead of raw token, which
  // atomically keeps track of the signed-in state.
  let product = new Product('alphaseek.io', {auth});

  // Save product
  product = await prod.create();

  // Note that from field is the referral code of another referring user.
  const user = await new User('user1@gmail.com', {product, from: '916hqpB7'}).create();

  // Get user's unique referral link and code
  const {url, moniker, score, referrer} = user.referral;

  console.log(url);         // https://alphaseek.me/i/99PpQrh7
  console.log(moniker);     // 99PpQrh7
  console.log(score);       // 1
  console.log(referrer.referral.moniker); // 916hqpB7
}

```

## Authentication

To log into your account, use an `Auth` as a static class or instantiate a singleton object. It is a single source of truth for your account identity as Alphaseek customer.

### Static

```js

import {Auth} from 'referkit';

const token = await Auth.login('joe@awesome.app', 'secretP&ssw0rd!');

```

The token will be stored in the browser's `localStorage` if it's available and also in-memory as a static variable.

You can opt-out of storing the token in the browser's localStorage by setting `Auth.useLocalStorage = false` before calling `login()`.

To log out (invalidate the access token):

```js

const ok = await Auth.logout();

```

This also clears old token from the localStorage if `Auth.useLocalStorage` is set to `true`.

### Singleton

You can also create an `Auth` singleton instance so you could pass it around in other calls.

```js

const auth = new Auth();
const tok = await auth.login('joe@awesome.app', 'secretPassword');

// Create a new product.
const prod = new Product('awesome.app', {auth});

```

Optionally, you could pass the access token as `token` field in the object parameter
like so:

```js

const prod = new Product('awesome.app', {token: tok});

```

You can also inquire for your account information with

```js

const myInfo = await auth.me();

```

## Product

A `Product` is the namespace of a campaign and its `User`s.
An account has a default `Product` tied to its registered email address's domain name,
for instance, a `Product` with alias *awesome-app-732109* is tied to a domain name
*awesome.app*.

An account can create more than one `Product`. `Product`s cannot share their `User`s
across them.

```js

const prod = new Product('awesome.app', {auth});

```

## User

The core of a referral is in the users' interactions. Here are some key points
about a `User`:

- only have one referrer (another `User` who refers), but many
referrees (other `User`s whom this `User` refers to your `Product`)
- owns a unique referral URL and a related referral code (called moniker) per `Product`
- owns a referral score that increments when a new `User` is created with his moniker
OR when he is created as a `User` with a referral code of someone else (2-side rewarding)

Your user's referral URL has a destination URL that it redirects to. For instance,
you could set it to your signup form page i.e. `https://awesome.app/signup`. When it
actually redirects to the destination URL, it adds the following query parameters

> ?from=916hqpB7&source=alphaseek&type=referral

Your signup form should design a hidden form field that grabs the referral code
from the `from` field or use JavaScript to do so to create the `User`

```js

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get('source') === 'alphaseek') {
  const from = urlParams.get('from');
  let user = new User('john.smith@gmail.com', {from, product});
  user = await user.create();
}

```

### Use cases

- 2-sided reward when a user signed up
- Successful purchase with "coupon" code
- Invitation queue based on referrals

### Referral and Destination URLs

You can set the destination URL where the referral URL will redirect to
by calling `update` method on the `User`.

You can't change the user's default referral URL.

```js

user = await user.update({redirectUrl: 'https://awesome.app/signup'});

```

Most of the time, you may want to set a default destination on the `Product` either when
creating it or updating it instead of setting one for each `User`.

```js

// Create
const prod = new Product('awesome.app', {auth, redirectUrl: 'https://awesome.app/signup'});

// Update
prod = await prod.update({redirectUrl: 'https://signup.awesome.io/form'});

```