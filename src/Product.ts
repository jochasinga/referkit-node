import axios from 'axios';
import {Auth} from './auth';
import {productUrl} from './endpoints';

interface AuthConfig {
  auth?: Auth;
  token?: string;
}

interface ProductInterface {
  uid: string;
  alias: string;
  domain: string;
  created: Date;
}

export class Product implements ProductInterface {
  uid: string = '';
  alias: string = '';
  domain: string = '';
  created: Date = new Date();

  private static _token: string = '';

  constructor(domain: string, config: AuthConfig) {
    this.domain = domain;
    let {auth, token} = config;
    if (auth !== undefined) {
      Product._token = auth.token;
    } else if (token !== undefined) {
      Product._token = token;
    }
  }

  async create(): Promise<Product> {
    try {
      const res = await axios.post(productUrl, {
        headers: {
          'Authorization': `Bearer ${Product._token}`,
        }
      });
      const {product} = res.data;
      const {uid, alias, domain, created} = product;
      this.uid = uid;
      this.alias = alias;
      this.domain = domain;
      this.created = new Date(created);
      return this;
    } catch (err) {
      return err;
    }
  }

  async get(alias: string = ''): Promise<Product> {
    let productAlias = '';
    if (alias === '') {
      productAlias = this.alias;
    } else {
      productAlias = alias;
    }
    try {
      const url: string = productUrl + '/' + productAlias;
      const res = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${Product._token}`,
        }
      });
      const {product} = res.data;
      const {uid, alias, domain, created} = product;
      this.uid = uid;
      this.alias = alias;
      this.domain = domain;
      this.created = new Date(created);
      return this;
    } catch (err) {
      return err;
    }
  }
}

