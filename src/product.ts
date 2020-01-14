import axios from 'axios';
import {Auth} from './auth';
import {productUrl} from './endpoints';

interface AuthConfig {
  auth?: Auth;
}

type UpdateProps = {
  alias?: string;
  domain?: string;
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
  auth: Auth|undefined;

  constructor(domain: string, config: AuthConfig) {
    const {auth} = config;
    this.auth = auth;
    this.domain = domain;
  }

  async create(): Promise<Product> {
    if (!(this.auth?.isLoggedIn)) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    try {
      const res = await axios.post(productUrl, {
        headers: {
          'Authorization': `Bearer ${this.auth?.token}`,
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
    if (!(this.auth?.isLoggedIn)) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

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
          'Authorization': `Bearer ${this.auth?.token}`,
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

  async update(props: UpdateProps): Promise<Product> {
    if (!(this.auth?.isLoggedIn)) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    let duplicateAlias = false;
    let duplicateDomain = false;
    try {
      let p = await this.get();
      if (props.alias !== undefined) {
        duplicateAlias = (p.alias === props.alias);
      }
      if (props.domain !== undefined) {
        duplicateDomain = (p.domain === props.domain);
      }
      if (duplicateAlias && duplicateDomain) {
        return this;
      }
    } catch (err) {
      return err;
    }

    try {
      const url: string = productUrl + '/' + this.alias;
      const res = await axios.post(url, {
        alias: props.alias,
        domain: props.domain,
        headers: {
          'Authorization': `Bearer ${this.auth?.token}`,
        }
      });
      const {product} = res.data;
      return <Product>product;
    } catch (err) {
      return err;
    }
  }

  async delete(): Promise<boolean> {
    if (!(this.auth?.isLoggedIn)) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    try {
      const url: string = productUrl + '/' + this.alias;
      const res = await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${this.auth?.token}`,
        }
      });
      const {success} = res.data;
      return success;
    } catch (err) {
      return false;
    }
  }
}

