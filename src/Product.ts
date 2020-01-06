import axios from 'axios';
import {Auth} from './auth';
import {productUrl} from './endpoints';

interface AuthConfig {
  auth?: Auth;
  token?: string;
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

  async update(props: UpdateProps): Promise<Product> {
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
          'Authorization': `Bearer ${Product._token}`,
        }
      });
      const {product} = res.data;
      return <Product>product;
    } catch (err) {
      return err;
    }
  }

  async delete(): Promise<boolean> {
    try {
      const url: string = productUrl + '/' + this.alias;
      const res = await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${Product._token}`,
        }
      });
      const {success} = res.data;
      return success;
    } catch (err) {
      return false;
    }
  }
}

