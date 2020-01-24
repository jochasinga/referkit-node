import axios from 'axios';
import { Auth } from './auth';
import { productUrl } from './endpoints';

interface IAuthConfig {
  auth?: Auth;
}

interface IUpdateProps {
  alias?: string;
  domain?: string;
}

interface IProduct {
  uid: string;
  alias: string;
  domain: string;
  created: Date;
}

const key = 'alphaseekToken';

export class Product implements IProduct {
  public uid: string = '';
  public alias: string = '';
  public domain: string = '';
  public created: Date = new Date();
  public auth: Auth | undefined;

  constructor(domain: string, config: IAuthConfig) {
    const { auth } = config;
    this.auth = auth;
    this.domain = domain;
  }

  public async create(): Promise<Product> {
    let tok: string = '';
    if (window && window.localStorage) {
      tok = window.localStorage.getItem(key) || '';
    }

    if (tok === '' && !this.auth?.isLoggedIn) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    if (this.auth?.token) {
      tok = this.auth?.token;
    }

    try {
      const res = await axios.post(productUrl, {
        headers: {
          Authorization: `Bearer ${tok}`,
        },
      });
      const { product } = res.data;
      const { uid, alias, domain, created } = product;
      this.uid = uid;
      this.alias = alias;
      this.domain = domain;
      this.created = new Date(created);
      return this;
    } catch (err) {
      return err;
    }
  }

  public async get(_alias: string = ''): Promise<Product> {
    if (!this.auth?.isLoggedIn) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    let productAlias = '';
    if (_alias === '') {
      productAlias = this.alias;
    } else {
      productAlias = _alias;
    }
    try {
      const url: string = productUrl + '/' + productAlias;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.auth?.token}`,
        },
      });
      const { product } = res.data;
      const { uid, alias, domain, created } = product;
      this.uid = uid;
      this.alias = alias;
      this.domain = domain;
      this.created = new Date(created);
      return this;
    } catch (err) {
      return err;
    }
  }

  public async update(props: IUpdateProps): Promise<Product> {
    if (!this.auth?.isLoggedIn) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    let duplicateAlias = false;
    let duplicateDomain = false;
    try {
      const p = await this.get();
      if (props.alias !== undefined) {
        duplicateAlias = p.alias === props.alias;
      }
      if (props.domain !== undefined) {
        duplicateDomain = p.domain === props.domain;
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
          Authorization: `Bearer ${this.auth?.token}`,
        },
      });
      const { product } = res.data;
      return product as Product;
    } catch (err) {
      return err;
    }
  }

  public async delete(): Promise<boolean> {
    if (!this.auth?.isLoggedIn) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    try {
      const url: string = productUrl + '/' + this.alias;
      const res = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${this.auth?.token}`,
        },
      });
      const { success } = res.data;
      return success;
    } catch (err) {
      return false;
    }
  }
}
