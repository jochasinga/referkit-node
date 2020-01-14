const hostname = 'https://api.alphaseek.io';
const baseUrl = '/v0';

// Auth endpoints
const loginUrl = hostname + baseUrl + '/login';
const logoutUrl = hostname + baseUrl + '/logout';
const productUrl = hostname + baseUrl + '/products';
const meUrl = hostname + baseUrl + '/me';
const userUrl = hostname + baseUrl + '/users';

export {loginUrl, logoutUrl, productUrl, meUrl, userUrl};